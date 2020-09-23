package com.example.demo.service;

import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.ec.CustomNamedCurves;
import org.bouncycastle.crypto.params.ECDomainParameters;
import org.bouncycastle.crypto.params.ECPrivateKeyParameters;
import org.bouncycastle.crypto.params.ECPublicKeyParameters;
import org.bouncycastle.crypto.params.ParametersWithRandom;
import org.bouncycastle.crypto.prng.FixedSecureRandom;
import org.bouncycastle.crypto.signers.ECDSASigner;
import org.bouncycastle.crypto.signers.HMacDSAKCalculator;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.spec.ECNamedCurveParameterSpec;
import org.bouncycastle.math.ec.ECCurve;
import org.bouncycastle.math.ec.ECPoint;
import org.bouncycastle.util.encoders.Hex;

import java.math.BigInteger;
import java.security.SecureRandom;


/***********************************************************************************************
 * 												*
 *		Ellipische Kurven-Operationen Secp256k1 mit Bouncycastle			*
 *		-	Erstellung einer ECDSA Signatur						*
 *		-	Verifizierung der ECDSA Signatur					*
 *		-	EC-Multiplikation und Addition						*
 *												*
 ***********************************************************************************************/


public class Bouncycastle_Secp256k1 {

    private static final X9ECParameters CURVE_PARAMS = CustomNamedCurves.getByName("secp256k1");
    static final ECDomainParameters CURVE = new ECDomainParameters(
            CURVE_PARAMS.getCurve(), CURVE_PARAMS.getG(), CURVE_PARAMS.getN(), CURVE_PARAMS.getH());
    /**
     * Es wird eine Signatur erstellt bestehend aus den Teilen "r" und "s".
     * Übergeben wird der 32byte lange Hash, der signiert werden soll,
     * - der Priv.Key 32Byte,
     * - die Zufallszahl "k" als ByteArray.
     * Rückgabe ist ein BigInteger-Array bestehend aus 2 Elementen: [0] = r   und    [1] = s.
     * Achtung: Die Zufallszahl "k" muss aus einer kryptographisch starken Entropie stammen!
     * Falls "k" vorhersebar ist, kann der Priv.Key leicht aufgedeckt werden!!!
     */
    public static BigInteger[] sig(byte[] hash, byte[] priv, byte[] k) {
        k = Secp256k1.to_fixLength(k, 32);

        ECPrivateKeyParameters priKey = new ECPrivateKeyParameters(new BigInteger(1,priv), CURVE);
        ECDSASigner signer = new ECDSASigner(new HMacDSAKCalculator(new SHA256Digest()));
        SecureRandom rand = new FixedSecureRandom(k);
        signer.init(true, new ParametersWithRandom(priKey, rand));
        BigInteger[] sig = signer.generateSignature(hash);
        return sig;
    }



//    public static boolean verify(byte[] hash, BigInteger[] sig, String pub) {
//
//        ECDSASigner signer = new ECDSASigner(new HMacDSAKCalculator(new SHA256Digest()));
//
//        ECPublicKeyParameters pubKey = new ECPublicKeyParameters(CURVE.getCurve().decodePoint(Hex.decode(pub)), CURVE);
//        signer.init(false, pubKey);
//        if (signer.verifySignature(hash, sig[0], sig[1])) {
//            return true;
//        } else {
//            return false;
//        }
//    }

    public static boolean verify(byte[] hash, BigInteger[] sig, String pub) {
//        String privateKeyStr = "lVKXDndWw1yJBuJXYNUxm0IA31dmOVQs";
//        ECDSASigner signer = new ECDSASigner(new HMacDSAKCalculator(new SHA256Digest()));
//
//        ECPublicKeyParameters pubKey = new ECPublicKeyParameters(CURVE.getCurve().decodePoint(Test.generatePublicKey(privateKeyStr.getBytes())), CURVE);
//        signer.init(false, pubKey);
//        if (signer.verifySignature(hash, sig[0], sig[1])) {
//            return true;
//        } else {
//            return false;
//        }
       return verify(hash,sig,Hex.decode(pub));
    }

    public static boolean verify(byte[] hash, BigInteger[] sig, byte[] pub) {
        ECDSASigner signer = new ECDSASigner(new HMacDSAKCalculator(new SHA256Digest()));

        ECPublicKeyParameters pubKey = new ECPublicKeyParameters(CURVE.getCurve().decodePoint(pub), CURVE);
        signer.init(false, pubKey);
        if (signer.verifySignature(hash, sig[0], sig[1])) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * Multipliziert den Generator-Punkt mit dem factor.
     */
    public static BigInteger[] mul_G(BigInteger factor) {
        ECNamedCurveParameterSpec spec = ECNamedCurveTable.getParameterSpec("secp256k1");
        ECPoint Q = spec.getG().multiply(factor).normalize();
        BigInteger[] erg = new BigInteger[2];
        erg[0] = Q.getAffineXCoord().toBigInteger();
        erg[1] = Q.getAffineYCoord().toBigInteger();
        return erg;
    }


    /**
     * Multipliziert einen Punkt "point" auf der elliptischen Kurve mit dem factor.
     */
    public static BigInteger[] mul_Point(BigInteger[] point, BigInteger factor) {
        ECNamedCurveParameterSpec spec = ECNamedCurveTable.getParameterSpec("secp256k1");
        ECCurve curve = spec.getCurve();
        ECPoint P = curve.createPoint(point[0], point[1]);
        ECPoint Q = P.multiply(factor).normalize();
        BigInteger[] erg = new BigInteger[2];
        erg[0] = Q.getAffineXCoord().toBigInteger();
        erg[1] = Q.getAffineYCoord().toBigInteger();
        return erg;
    }



    /**
     * Addiert zwei Punkte auf der elliptischen Kurve.
     */
    public static BigInteger[] add(BigInteger[] a, BigInteger[] b) {
        ECNamedCurveParameterSpec spec = ECNamedCurveTable.getParameterSpec("secp256k1");
        ECCurve curve = spec.getCurve();
        ECPoint P = curve.createPoint(a[0], a[1]);
        ECPoint Q = curve.createPoint(b[0], b[1]);
        ECPoint R = P.add(Q).normalize();
        BigInteger[] erg = new BigInteger[2];
        erg[0] = R.getAffineXCoord().toBigInteger();
        erg[1] = R.getAffineYCoord().toBigInteger();
        return erg;
    }


}