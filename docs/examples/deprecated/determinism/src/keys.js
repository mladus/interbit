const RANDOM_PUBLIC_PGP = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v2.5.2
Comment: http://openpgpjs.org

xk0EWN0/BQEB/1R8H/WSzYR97uXnm7XpynjIlo6WK+qTuzQr3Gtb5Q6jV/HO
7Yl9BjCbpbA4OXdT/1CImJ53zvJBZAcNUrW9Wc8AEQEAAc0RQlRMIDxpbmZv
QGJ0bC5jbz7CdQQQAQgAKQUCWN0/BQYLCQcIAwIJEEq0xDiCCwdsBBUICgID
FgIBAhkBAhsDAh4BAAAO7AH9E9DuIPDCDGAmREffEDtbP4JOjzIl45VqoH5M
PThXGWNuYVb9Nn7GD8iCqBHRFhhhaXMVuDr7e68qd/I+CvKX0c5NBFjdPwUB
Af9soNyJh4Sv3zuh2kG0byjTtGMFwTZ+QmnEYtlm/q4F59J5gmlv52OTY+bH
a2HLGmzuTFxwr1jkSOA8CfYp85/nABEBAAHCXwQYAQgAEwUCWN0/BQkQSrTE
OIILB2wCGwwAAHHIAf9Ohcudsms6N9d6uGRXfLy/Ltu8uR37fmG242zjCLg4
fT2QuwcZCN8hKMUuD2kvbh502ov9Kdr8cE81Mxs+pkPC
=yjbz
-----END PGP PUBLIC KEY BLOCK-----`

const RANDOM_PRIVATE_PGP = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v2.5.2
Comment: http://openpgpjs.org

xcA4BFjdPwUBAf9UfB/1ks2Efe7l55u16cp4yJaOlivqk7s0K9xrW+UOo1fx
zu2JfQYwm6WwODl3U/9QiJied87yQWQHDVK1vVnPABEBAAEAAf4tLVbVtdPK
ZqEqNYixZTxNDE5eHvWK8caoZk/u5Ov+wELJQORB4gu7FHSqx6U3z1zUCEXU
Ryt3bZ9V3GHCxoehAQCVGqKCG/e6kMLUl8qHWob/V+Wc0wlwai93fSNDVXYk
PwEAkQ3NRuetnwm+n48o8wy37Yuf/zO3PqfpUVt6qcdKJnEA/jB+dw2dwfyN
ckQxDo5Yk/ewgCmvTarHLebslkR0BOlSVCjNEUJUTCA8aW5mb0BidGwuY28+
wnUEEAEIACkFAljdPwUGCwkHCAMCCRBKtMQ4ggsHbAQVCAoCAxYCAQIZAQIb
AwIeAQAADuwB/RPQ7iDwwgxgJkRH3xA7Wz+CTo8yJeOVaqB+TD04VxljbmFW
/TZ+xg/IgqgR0RYYYWlzFbg6+3uvKnfyPgryl9HHwDgEWN0/BQEB/2yg3ImH
hK/fO6HaQbRvKNO0YwXBNn5CacRi2Wb+rgXn0nmCaW/nY5Nj5sdrYcsabO5M
XHCvWORI4DwJ9inzn+cAEQEAAQAB+gKu+qO/IE0D88Is1SCy+kw4kZWrzz/R
PjGmy34a3ouwxPVJLGSiWLRMgfRMWwMFvQeNJJXMN4AxIscfuf23oSkBANB4
sGFjsLXXy5l30dlGEbdodaF1mA3RKiLwDBDAigKzAQCFZOQbr2/dirOd++dw
RGbInBtVecc8dnp0hP6CrFu3/QD+K1u7hevd8Ax5SO91iHbdwbQ2BpfWSenq
RJXU4XFwJhBVS8JfBBgBCAATBQJY3T8FCRBKtMQ4ggsHbAIbDAAAccgB/06F
y52yazo313q4ZFd8vL8u27y5Hft+YbbjbOMIuDh9PZC7BxkI3yEoxS4PaS9u
HnTai/0p2vxwTzUzGz6mQ8I=
=7Bd2
-----END PGP PRIVATE KEY BLOCK-----`

export default {
  // when using openpgp
  random: {
    public: RANDOM_PUBLIC_PGP,
    private: RANDOM_PRIVATE_PGP
  }
}