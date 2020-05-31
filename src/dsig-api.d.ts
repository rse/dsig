/*!
**  DSIG -- Digital Signature with OpenPGP
**  Copyright (c) 2015-2020 Dr. Ralf S. Engelschall <rse@engelschall.com>
**  Licensed under LGPL 3.0 <https://spdx.org/licenses/LGPL-3.0-only>
*/

declare module "DSIG" {
    class DSIG {
        /*  generate a private/public key pair  */
        static keygen (
            userName:           string,                      /*  name of user  */
            userEmail:          string,                      /*  email address of user  */
            passPhrase:         string                       /*  pass-phrase of private key  */
        ): Promise<{
            privateKey:         string,                      /*  private key (encrypted)  */
            publicKey:          string                       /*  public key  */
        }>;

        /*  calculate fingerprint of public or private key  */
        static fingerprint (
            publicOrPrivateKey: string,                      /*  public or private key  */
            passPhrase?:        string                       /*  pass-phrase of private key  */
        ): Promise<{
            fingerPrint:        string                       /*  finger-print of public/private key  */
        }>;

        /*  sign payload with private key  */
        static sign (
            payload:            string|Buffer,               /*  payload to sign  */
            privateKey:         string,                      /*  private key  */
            passPhrase:         string,                      /*  pass-phrase of private key  */
            metaInfo?:          string,                      /*  optional meta information  */
        ): Promise<{
            signature:          string                       /*  signature  */
        }>;

        /*  verify payload with public key and fingerprint  */
        static verify (
            payload:            string|Buffer,               /*  payload to verify  */
            signature:          string,                      /*  signature  */
            publicKey:          string,                      /*  public key  */
            fingerPrint:        string                       /*  finger-print of public/private key  */
        ): Promise <{
            metaInfo:           string                       /*  optional meta information  */
        }>;
    }
    export = DSIG
}

