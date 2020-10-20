package com.example.demo.service;

import com.alibaba.fastjson.JSONObject;
import com.example.demo.entity.KeyPair;
import net.consensys.cava.bytes.Bytes;
import net.consensys.cava.crypto.Hash;
import net.consensys.cava.crypto.SECP256K1;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.encoders.Hex;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Security;
import java.util.Random;

/**
 * @author yunfeiyanggzq
 */

public class AuthenticationService {
    static final String MSK = "3f9fe839273f21567f08441470e797c42535409253b5eae4501d42506ffa5c4d";

    static String compressPubKey(SECP256K1.PublicKey publicKey) {
        BigInteger pubKey = new BigInteger(1, publicKey.bytesArray());
        String pubKeyYPrefix = pubKey.testBit(0) ? "03" : "02";
        String pubKeyHex = pubKey.toString(16);
        String pubKeyX = pubKeyHex.substring(0, 64);
        return pubKeyYPrefix + pubKeyX;
    }

    public static String generatePublicKey() {
        SECP256K1.KeyPair keyPair = SECP256K1.KeyPair.fromSecretKey(SECP256K1.SecretKey.fromInteger(new BigInteger(
                MSK, 16)));
        return compressPubKey(keyPair.publicKey());
    }

    public static byte[] hex2Bytes(String str) {
        if (str == null || str.trim().equals("")) {
            return new byte[0];
        }

        byte[] bytes = new byte[str.length() / 2];
        for (int i = 0; i < str.length() / 2; i++) {
            String subStr = str.substring(i * 2, i * 2 + 2);
            bytes[i] = (byte) Integer.parseInt(subStr, 16);
        }

        return bytes;
    }

    public static String randomHexString(int len) {
        try {
            StringBuffer result = new StringBuffer();
            for (int i = 0; i < len; i++) {
                result.append(Integer.toHexString(new Random().nextInt(16)));
            }
            return result.toString().toUpperCase();

        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();

        }
        return null;

    }

    public static String getMsk() {
        return MSK;
    }

    public static String sign(String sk, String msg) {
        byte[] msgHash = Hash.sha2_256(msg.getBytes());
        SECP256K1.KeyPair keys = SECP256K1.KeyPair.fromSecretKey(SECP256K1.SecretKey.fromInteger(new BigInteger(
                sk, 16)));
        SECP256K1.Signature signature = SECP256K1.signHashed(msgHash, keys);
        String s = signature.bytes().toString();
        return s.substring(0, s.length() - 2).toLowerCase();

    }

    public static boolean verify(String sign, String data, String pub) {
        try {
            byte[] msgHash = Hash.sha2_256(data.getBytes());
            sign = sign.substring(2, sign.length());
            sign = "0x" + sign.toUpperCase();
            String cert1 = sign + "01";
            String cert2 = sign + "00";
            SECP256K1.Signature sig1 = SECP256K1.Signature.fromBytes(Bytes.fromHexString(cert1));
            SECP256K1.Signature sig2 = SECP256K1.Signature.fromBytes(Bytes.fromHexString(cert2));
            SECP256K1.PublicKey recoveredPubKey1 = SECP256K1.PublicKey.recoverFromHashAndSignature(msgHash, sig1);
            SECP256K1.PublicKey recoveredPubKey2 = SECP256K1.PublicKey.recoverFromHashAndSignature(msgHash, sig2);
            return compressPubKey(recoveredPubKey1).equals(pub) ^ compressPubKey(recoveredPubKey2).equals(pub);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    public static KeyPair generateKeyPair() {
        String pri = randomHexString(MSK.length());
        SECP256K1.KeyPair keys = SECP256K1.KeyPair.fromSecretKey(SECP256K1.SecretKey.fromInteger(new BigInteger(
                pri, 16)));
        KeyPair keyPair = new KeyPair();
        keyPair.setPri(Hex.toHexString(keys.secretKey().bytesArray()));
        keyPair.setPub(compressPubKey(keys.publicKey()));
        return keyPair;
    }

    public static String SHA(final String strText, final String strType)
    {
        // 返回值
        String strResult = null;

        // 是否是有效字符串
        if (strText != null && strText.length() > 0)
        {
            try
            {
                // SHA 加密开始
                // 创建加密对象 并傳入加密類型
                MessageDigest messageDigest = MessageDigest.getInstance(strType);
                // 传入要加密的字符串
                messageDigest.update(strText.getBytes(StandardCharsets.UTF_8));
                // 得到 byte 類型结果
                byte byteBuffer[] = messageDigest.digest();

                // 將 byte 轉換爲 string
                StringBuffer strHexString = new StringBuffer();
                // 遍歷 byte buffer
                for (int i = 0; i < byteBuffer.length; i++)
                {
                    String hex = Integer.toHexString(0xff & byteBuffer[i]);
                    if (hex.length() == 1)
                    {
                        strHexString.append('0');
                    }
                    strHexString.append(hex);
                }
                // 得到返回結果
                strResult = strHexString.toString();
            }
            catch (NoSuchAlgorithmException e)
            {
                e.printStackTrace();
            }
        }

        return strResult;
    }
    public static void main(String[] args) {
        Security.addProvider(new BouncyCastleProvider());
//        for(int i=0;i<100;i++){
//            KeyPair keyPair = generateKeyPair();
//            KeyPair keyPair1 = generateKeyPair();
//            String sign = sign(keyPair.getPri(), "test data without newline");
////            System.out.println(sign);
//            boolean ret = verify(sign, "test data without newline", keyPair.getPub());
//            System.out.println("正确结果" + ret);
////            boolean ret1 = verify(sign, "test data without newline", keyPair1.getPub());
////            System.out.println("替换秘钥" + ret1);
////            String sign1 = sign(keyPair.getPri(), "test data withoutnewline");
//
////            boolean ret2 = verify(sign1, "test data without newline", keyPair.getPub());
////            System.out.println("替换签名" + ret2);
//
//        }

        JSONObject object = new JSONObject();
        object.put("name", "zhangsan");
        System.out.println(object.toString());
        String pub= generatePublicKey();
        System.out.println("公钥"+pub);
        System.out.println("私钥"+MSK);
        String sign = sign("b823be13f5070e934a684f3896160fb0cb77c4fc62ef7f22c46c46a6ae274f35", object.toString());
        System.out.println("数据"+"test data without newline");
        System.out.println("签名" + sign);
       boolean ret1 = verify("0xc68f32b0e1b3d93911bad4110399a81771752b54c02463e65477533e96aa087b0ca6d34e9a2c614a552dd81235f537f399f86f2cbc6ab5c338cfc16b385d26b1", "test data without newline", "03d645d07206207cd8327e0aef11e2cfbfce2e267b1df0fffc4df681ce46d72d2c");
        System.out.println(ret1);
        System.out.println(SHA("你好", "SHA-256"));

    }
}
//
//    公钥03d645d07206207cd8327e0aef11e2cfbfce2e267b1df0fffc4df681ce46d72d2c
//            私钥3f9fe839273f21567f08441470e797c42535409253b5eae4501d42506ffa5c4d
//    数据test data without newline
//签名0xc68f32b0e1b3d93911bad4110399a81771752b54c02463e65477533e96aa087b0ca6d34e9a2c614a552dd81235f537f399f86f2cbc6ab5c338cfc16b385d26b1
//        true
