package com.example.demo.service;

import com.example.demo.entity.KeyPair;
import com.example.demo.service.cryptography.Bouncycastle_Secp256k1;
import org.apache.commons.lang3.StringUtils;
import org.bouncycastle.util.encoders.Hex;

import java.math.BigInteger;

/**
 * @author yunfeiyanggzq
 */

public class AuthenticationService {
    static final String MSK = "lVKXDndWw1yJBuJXYNUxm0IA31dmOVQ1";

    public static String generatePublicKey() {
        return Hex.toHexString(Bouncycastle_Secp256k1.generatePublicKey(MSK.getBytes()));
    }

    public static String getMsk() {
        return MSK;
    }

    public static String sign(String csk, String msg) {
        try {
            String hex = Bouncycastle_Secp256k1.randomHexString(42);
            byte[] rand = Bouncycastle_Secp256k1.hex2Bytes(hex);
            BigInteger[] sig = Bouncycastle_Secp256k1.sig(msg.getBytes(), csk.getBytes(), rand);
            String sign = sig[0].toString(16) + sig[1].toString(16);
            if (sign.length() != 128) {
                sign = StringUtils.leftPad(sig[0].toString(16), 64, '0') + StringUtils.leftPad(sig[1].toString(16), 64, '0');
            }
            return sign;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    public static boolean verify(String sign, String data, String pub) {
        try {
            BigInteger[] sig = new BigInteger[2];
            int len = sign.length();
            sig[0] = new BigInteger(sign.substring(0, len / 2), 16);
            sig[1] = new BigInteger(sign.substring(len / 2, len), 16);
            return Bouncycastle_Secp256k1.verify(data.getBytes(), sig, pub);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }

    public static KeyPair generateKeyPair() {
        String pri = Bouncycastle_Secp256k1.randomHexString(32);
        String pub = Hex.toHexString(Bouncycastle_Secp256k1.generatePublicKey(pri.getBytes()));
        KeyPair keyPair = new KeyPair();
        keyPair.setPri(pri);
        keyPair.setPub(pub);
        return keyPair;
    }

    public static void main(String[] args) {
        KeyPair keyPair = generateKeyPair();
        String sign = sign(keyPair.getPri(), "nihao");
        boolean ret = verify(sign, "nihao", keyPair.getPub());
        System.out.println(ret);
    }
}
