package com.example.demo.service;

import com.alibaba.fastjson.JSONObject;
import com.example.demo.entity.KeyPair;
import net.consensys.cava.bytes.Bytes;
import net.consensys.cava.crypto.Hash;
import net.consensys.cava.crypto.SECP256K1;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.encoders.Hex;
import org.nervos.ckb.crypto.Blake2b;

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
        Blake2b hash = new Blake2b();
        hash.update(msg.getBytes());
        byte[] msgHash = hash.doFinalBytes();
        SECP256K1.KeyPair keys = SECP256K1.KeyPair.fromSecretKey(SECP256K1.SecretKey.fromInteger(new BigInteger(
                sk, 16)));
        SECP256K1.Signature signature = SECP256K1.signHashed(msgHash, keys);
        String s = signature.bytes().toString();
        return s.substring(0, s.length() - 2).toLowerCase();

    }

    public static boolean verify(String sign, String data, String pub) {
        try {
            Blake2b hash = new Blake2b();
            hash.update(data.getBytes());
            byte[] msgHash = hash.doFinalBytes();
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
}