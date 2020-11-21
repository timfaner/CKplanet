package com.example.demo.service.cryptography;
import net.consensys.cava.bytes.Bytes;
import net.consensys.cava.crypto.SECP256K1;
import net.consensys.cava.crypto.Hash;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.encoders.Hex;
import org.bouncycastle.util.encoders.HexEncoder;

import java.math.BigInteger;
import java.security.Security;
import java.security.spec.PKCS8EncodedKeySpec;

public class EcdsaSecp256k1ExampleCava {

    static String compressPubKey(SECP256K1.PublicKey publicKey) {
        BigInteger pubKey = new BigInteger(1, publicKey.bytesArray());
        String pubKeyYPrefix = pubKey.testBit(0) ? "03" : "02";
        String pubKeyHex = pubKey.toString(16);
        String pubKeyX = pubKeyHex.substring(0, 64);
        return pubKeyYPrefix + pubKeyX;
    }

    public static void main(String[] args) throws Exception {
        // One-time registration of the "BouncyCastle" JCA provider
        Security.addProvider(new BouncyCastleProvider());

        // Generate random key-pair
        // SECP256K1.KeyPair keyPair = SECP256K1.KeyPair.random();

        // Load key-pair from existing private key
        SECP256K1.KeyPair keyPair = SECP256K1.KeyPair.fromSecretKey(SECP256K1.SecretKey.fromInteger(new BigInteger(
                "3f9fe839273f21567f08441470e797c42535409253b5eae4501d42506ffa5c4d", 16)));

        System.out.println("Private key (256 bits): " +
                Hex.toHexString(keyPair.secretKey().bytesArray()));
        System.out.println("Public key (512 bits): 04" +
                Hex.toHexString(keyPair.publicKey().bytesArray()));
        System.out.println("Public key (compressed): " +
                compressPubKey(keyPair.publicKey()));

        // Sign a message
        String msg = "test data without newline";
        byte[] msgHash = Hash.sha2_256(msg.getBytes());
        System.out.println(msgHash.toString()+"hash");
        SECP256K1.Signature signature = SECP256K1.signHashed(msgHash, keyPair);
        System.out.println(signature.r().toString(16)+signature.s().toString(16)+"签名");
        String s=signature.r().toString(16)+signature.s().toString(16);
        System.out.println("Msg: " + msg);
        System.out.println("Msg hash: " + Hex.toHexString(msgHash));
        System.out.printf(
                "Signature: [r = %s, s = %s, v = %d]\n",
                signature.r().toString(16),
                signature.s().toString(16),
                signature.v());
        System.out.println("(**************"+signature.bytes());
        System.out.println(signature.bytes().toString()+")))))))))))))");
        SECP256K1.Signature temp = SECP256K1.Signature.fromBytes(Bytes.fromHexString(signature.bytes().toString()));
//        String str=signature.r().toString(16);
//        String temp=new BigInteger(str,16).toString(16);
//        System.out.println(temp+"转换");
        // Verify the signature
//        SECP256K1.Signature temp = SECP256K1.Signature.fromBytes(signature.bytes());
        boolean validSig = SECP256K1.verifyHashed(
                msgHash, temp, keyPair.publicKey());
        System.out.println("!!!!!!!!Signature valid (correct key)? " + validSig);

        boolean validSigWrongKey = SECP256K1.verifyHashed(
                msgHash, signature, SECP256K1.KeyPair.random().publicKey());
        System.out.println("Signature valid (wrong key)? " + validSigWrongKey);
        int len=s.length();
        String before = s.substring(0, len / 2 );
        String after = s.substring(len / 2 , len);
        System.out.println(before);
        System.out.println(after);
        SECP256K1.Signature cert=SECP256K1.Signature.create((byte) 1,new BigInteger(signature.r().toString(16),16),new BigInteger("0ca6d34e9a2c614a552dd81235f537f399f86f2cbc6ab5c338cfc16b385d26b1",16));

        System.out.println(cert);

        boolean validSigWrongKey1 = SECP256K1.verifyHashed(
                msgHash, cert,  keyPair.publicKey());
        System.out.println("Signature valid (recover signature)? " + validSigWrongKey1);
        // Recover the public key from msg + signature
        SECP256K1.PublicKey recoveredPubKey = SECP256K1.PublicKey.
                recoverFromHashAndSignature(msgHash, signature);
        System.out.println("Recovered pubKey: 04" +
                Hex.toHexString(recoveredPubKey.bytesArray()));
        System.out.println("Signature valid ? " +
                recoveredPubKey.equals(keyPair.publicKey()));
    }
}
//0xc68f32b0e1b3d93911bad4110399a81771752b54c02463e65477533e96aa087b0ca6d34e9a2c614a552dd81235f537f399f86f2cbc6ab5c338cfc16b385d26b1
//0xC68F32B0E1B3D93911BAD4110399A81771752B54C02463E65477533E96AA087B0CA6D34E9A2C614A552DD81235F537F399F86F2CBC6AB5C338CFC16B385D26B101
//c68f32b0e1b3d93911bad4110399a81771752b54c02463e65477533e96aa087b 0 ca6d34e9a2c614a552dd81235f537f399f86f2cbc6ab5c338cfc16b385d26b1
//c68f32b0e1b3d93911bad4110399a81771752b54c02463e65477533e96aa087bca6d34e9a2c614a552dd81235f537f399f86f2cbc6ab5c338cfc16b385d26b1签名
//0xC68F32B0E1B3D93911BAD4110399A81771752B54C02463E65477533E96AA087B0CA6D34E9A2C614A552DD81235F537F399F86F2CBC6AB5C338CFC16B385D26B1
//0xc68f32b0e1b3d93911bad4110399a81771752b54c02463e65477533e96aa087b0ca6d34e9a2c614a552dd81235f537f399f86f2cbc6ab5c338cfc16b385d26b1   //私钥对数据哈希值的签名 64bytes