import { useState, useEffect, useCallback } from "react";

// ============================================================
// AZ CORPORATION — ECOSISTEMA UNIFICADO
// Una sola app con dos modos: Operador y Ciudadano.
// Ambos comparten el mismo window.storage, por lo que las
// publicaciones del operador aparecen en el modo ciudadano.
// ============================================================



const COLORS = {
  navy: "#1B3A5C", blue: "#2A5580", lightBlue: "#3A6B9C", green: "#3A5C2E",
  emerald: "#3A5C2E", lime: "#4A6B32", gold: "#4A6B32", orange: "#E65100",
  red: "#B71C1C", teal: "#00695C", gray: "#37474F", lightGray: "#F5F5F5",
  white: "#FFFFFF", bg: "#FAFBFC"
};

const AZ_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAAC3CAYAAADAfbZQAABaRUlEQVR42u29eZwmWVUm/Jxzb0S8a+5r7dVd3dVdQLMUskM2CH5sAwKmCjo67jAyzihu4JIUjjqOnwuoyIyiCA6fQ+koiiwOKIUiWyeL0EUv1UvWllWVe+a7Rtx7zvdHxJv5ZlZmVmZtvUb/oqsq810ibpx71uc8x+DRfTAARdh7sG/vE6a1NPztLuEdcEv/DECXf//4seXDPMrvjwAoTLHX2+Ibi4M37YTtGVGNbirYC/+SJKhka/C40GxjBz6aDwFGDeLp+1zS/Ip3Atu5s1kYvun1zdzBfwU6DgDwAOzjovC4hsmO4wzAswmmbaHz1T6IQrI5zZd7esD675TkAY2r38yERh4Xice2hgEwQgBgWRvG+ZCYJFHHMQoSDt6613QeOMod+38cgANGTWbGHj8euxpmggAoUW6Yc71v4FKPdeKJwKwgRKWSCVhe4ZrxtLovfqHN93n8eGxqGAhAcI3pf06SZIpEDTMULBAianiAO3f64tDB30dx38fQ3d3ZFkE9fjwGBaYVBAUijhmAikAhECiUQ6p7y9S5xxeGb35pnrt+chgoZP7M40Lz2BSYTGpUQCAwOBUHVagSyITU9DC2POTC/pt+fqrr5o8MDt5WBEgeN0+PXYEBQaE+VRxMDAOCIQDiwUyIE7EuPxwWBg+8cLa++OFd0Dww8rgj/JgVGKLUDLU9flLJpEFATEg8gYq9Luq/4Xmny3t+CTjmgMOP52keiwKjAJQBVUDblAZRKzBSGHiKnRru2mGLA/vfyqWdPwaMJ8DI40KDx1aGkxS0eQ2AAFaGQMgljsJyn1hNfrHBlpuLx/4wWy/3uMA8BrwXQBMmK0QMVbeJWyJIXxNwMxGNSkO7qKnvtmLgK/f/oaa5K/+4SXrUHmMEAGFp6FZrg04wC4ho07SNKkAMmIgSzfmwb79HoettxnY8IxMW87jAPGqPTzOg0ECfbEPbqcrS8lrW9XMIAPlUcIjgwMZTgNLgDbu0PPwXACI8hhN7j4GbPiYAkNSbn1ObnwLBALqFIqMAKmBmePHGm4IrDty4n8p735n+cuQxKTCPAdU6ysBxcGHH+4OunU/2NlSoGFrHhyGi5bMVPREURIATYc53JgR6hq/WQ8idn8RjsML9WNklyiYXmSjHKv6ysnCGCC5xNuweSoKegbfAlp+FlQr34wLz6AmPjgqKxUET5Z5AbEEgvpzELREAVXJqOTdwQ2S6drwT6C+1hWGPC8yjJZ5GHO9gE+4UstBUYtZXQ6qrzFP7z0UVxIAXGG87XK5n7zOoFP4RcNRn5YPHBeaRfxxOH2Q48DrOldSBkzRq3r7bocRZaKRwniwV+n2uc8d3I+h/Slo+eGyE2o9ygblBALAJKG+LHeI9MYFAilXO7VYOIYYSw6iAldCUAGH3DoSF0p9jpfvgUW+aHsW7YtQARz0KO54SFYZ+y3btipzAEitACiitm41ZT4jSnxE4q0ARAapCbEMFmbLUa9Pqq3fgMdC28ijWMBfSkqKab0dxoNephSEPpTQh15KL9lB6M43DkBQeQQSQwpCS8yDTtTMKygO/BeR34jGQ0HsU39wxAUAmjF5tcjkVcQxoqlzWcXZb57YWj4lEhKL+fUUuDf4RHgP9TY9WgTEAxIR9rwgKXbdRmFNtv1e9Oq6GqkLB7HM9LuoafBminhcjTeSZxwXmEXWMEADrTcfrbccAORgRCIi2pwA2M1Gt3ymARJmCrp3KYcdY5j897vQ+snIvEwoAYdf+Pwh7d5ViZSIiMtlvFbRhOLOdyKmV6IEqIwiVVfa6evUr8Hfc82h1gPnRKTBQEw2+IOoZKDuyAmoTA6WrHvuSCJyH2K5BULH7W1OzdMg8rmEeMRugc1/YveNfbO/+YuIFaQYFy6iGzbQLrfezDbRO+++EiMiyWiR90qjNqTv51UejlnmUaZgRBiCm2PkzUe+uoodx6XO9PJ2y1eiJWEFQUk+Iit37o0LHq7JygT6uYR7Wwj/hu7t37JbSjj+mrp3GeWFmpq36J+tpmC2IFUQdGARSo8ZETNJgkbu+KHH9zKNNy/CjTLvQos+/w3YNFxzllNhcJCzbLQlspHVWS5qC4UEgbkooKA7epFz4wVRQRh9V5YJHi8DYtADY91LbueM/IOrwqs5cjyeVdiIEYBUwHBzAEpatjbrfAHTekFazHz0b89FwIwSoBxAGPYPvyPXuEacWFg50XcBwDGiYFjThIEYpptDlSoMlG+Zfk17fyOMC8zAKoQmgnO248W8Kg/ufnrCBIDGUgitXmZINTcqWTVAK10wtmmb6JdUsnhmeCFYcyCekhV5ouee16Qtvl8cF5uHjtEtQ3vH6fNeOl0m+2yXqmaDQ63ZrCkAgMFAYsHqwenZBJEGh82nWdnwLcORRUy7gR/i1u7C846At9P180D2ceM+G1IDAV61edFkXxkzivUSlzpzmO34oM0v0uMA8pMcYAEQJ5/8sHLjxpgQ5I2oodWkyS/VQ2EiiFM4JMGweJiy9fO/evRFwzONRALB6hArMiIW+Xalj7/8uDN34TB+WkkSYiSjDrXiIYtvPZ7vwho38ISICVNibnFC+a9fpyeYL8SjByjwCb+BQCBxzXNzxI4W+A69GcdA57wNmBqX+A5QUwoqHNF9GgNNQbKGHFHTzo8UsPdIExgLHYyDaH3YM/7rp2OmbDoaIAXUZYZS2OaNX6sxe4ScoyER5BOXCvvQDB/RxgbmumgUOweAPREO3fSI3fLCnScRsDZESkGF1FQakDF5jKi7K7qoun7QSn2cdBQoRWQ6dV86LTc9mWWMDgGwAKpfn0NnZjbFDj3ig+CPl4g0Ab8sDz6Zc/8fKOw51NhFKAjATr5L6jfyQdQVm3det/ozW3zcTjI2+U4U0CgRu/sQD1XP3fQ/qs5/HI5wu5JGgYdL+ZdP5QuXyJ/NDN3bWKO9jMLMCrFc/J7Zd53fj7agQYtiooxCwvSH76SM6icePgOtzAAwX+4+Ud95S8LacJDAGbGGINryBtRphlRBcQiCY+eoUKwnkvHjYUpeYjtuzCM88LjDXTLOoAj23csdNf9ux50nPkFyPF+XAkAerQHV1+v/hdih5CMCKXA5C3wag65Gej3m4CoxJNQuR7eh/W/fgoZcltsfEYgygsOphNC0Cy8NY5tPGbiLmEEGU24tCIY9HODbmYbjah0IAHrbr+abz4Jfzu299fa3Y6xJ1llQAbbV3IG1K22T9l/O9ayKhlbA5PVNztfL39c5207bR79b+ntQgEJXEMiQq/l/UarMYHX1EI/EeZqSIIxY4FtvS8PNsoe+j+YEbS3HYoU6VDASUCcqKnOtVCvauUbQrBILTBAJ0dJ7CWTRx4YJ9XMNcHe3NaQZ34PVBx9DH8sMHS0nQ4bwXshKjBeK+ErTcQ5a0UEIYhMXdvfkdGBh4ROdi+GGyrIYAodyO3w27930wN3hTqcZlbSCwygYm62t+pB1KCiVlIoY260+vJdiJo0cfd3qvzLkdMSC4qPvmd+aHbvzPuaEbkwYiFRjiFFp9Sa2yXt5kPXKgZd+CNg/BN/qODRN0m3QXZFwREC97ZhbrJ9bY0sd9mG0KqweOIddzyztzPTf8hJb7XN0jIAWsutQEQeFgH5Eapk3VAMQJgBCP8MM+dJoFHrmhEcqVX5Ub2PcTWhzwdUcWpGnVGSl5oYCgRCB9JAqMrrjUZOgKNQtjo6LWo1hgKJ0MMp4g6H59WB78YNR/AM1cyTtxxjCBswlF2rbcfKlGsix0RtufqZlZv2Co11D4UpNHbZH7Vfu+tKQwAotjD928A76+WkUBjCfI7/jx8tCB3+gYvslRVPLi1ZDQJVP2V/ogN/J3ru0W0dV/XuYz6t/Z/1oA5UxY+NEuMDb1VyiH4r6/Lu289feDgZt2NyhnYiEDGLAS+BricNtrQ9ffLF1RvZEAwOSN2XXb4Md79+e+N/vAhwSHytdJWByi3heZ0oHPdO669dvRuVOqPpCEAgIZEAG8pk31chihNoqK1mZqL6JUFblk1narkdGqz24zieL95fowCgCz1dmvlzryt+2/afcHuvdEP9zmz1xXoTHX4fM9ooGXmHzfR0t7bt3t890uETIgJqZWX097xla3Fe5inRVbed/6n7Ux8eHF/LzbvZa1z5pV4Dkgkyw23OwDfwCgss2HrADIV3wtVzLP7NvVvScs4dttkdxSxdyLtyU1HHtUCMyIBU56RB0Hwu7dHyvuuqXcDMtJLCawpGB1WSSUalddpuJYP3+yKRvUw1Rg0lkFXtTm2PjG57viC/fWms0T2bpvR9sQgCTI2aVct3ml6daw2FN6dmisLPxF5VOjo6Pm+PHj16Xp/1oJjAUmHIDhcOAJd0XDT+hsUFFUxFrEYOI2E7wMjlwWlrUCst7DWkbCYe0wG91wuM1GwrAVgbkYrrlycnbtlFZGwbQirAKmkEBu4VyuuXj6v3vv57a/92AxATERnlTuzH1PVIAKfFTuLD+F8r7785/68j9kX3jNC5vm2ggLHND5otKeJ/9RYWDfvoaPRGGYSMFwSMnDaJV+oE0e7qW23lYzt1vhrNtMqDZ6FrTqc3SNcWUESMgtnCvFi2ffAaC+bb9jAnL48OEAyekTnTv6ujiQ5zgvjogLnZ3l5wZ57q5Xa/dLTNPX2qe52gKTZm9N/0tzO276SG7w5r2xgxhihgq0xS9Hl9aeD0+B2YpJbMu7pI48GSSilalvOJW/gKsvXcZDpcnJSVlYANk8frvUW+j16kkFYMB395ef02jGr/Rez7i6P34tNQ1fZc1CCIb/MD944GO5gZuDiuS95xynkpkWEIUM9BI4uVZybTMcSvvT2i5mZSum6kryNS1YZ2qkVEgde+//GCVexOUTDCk6UWINTpOYBERMRslJw9aw4PY+cXB//86Ony2V7HM1bX0wD2OByVpAeOCt+f59bywMH/A1ZSipESI4Ykimo1nXJ1d+OB1XL7mnysRKksyR1PdhaqpymQRD6R5bQKWzr+9tqsQAq6iCDCDibKJ1v+vmvqd17Cm+jYgGiOiazKa8CgIzxsDxGKbn23JDN/x8YceBpCqGiIkM6gB5eAZcNnTGbAPl3x4lPSIFRqHMarxrVrxU/gKt+U2Xc3wnGEBybuZBct4bgtE0KaEINIQ6NXVUsfsJQy8ffmLX76vqUJosvbq5NnMV3s8oNL8t6Nr94fzQTfkGLCuYKetxTsPlNI5gKFix2YzOjX0OQtrZSEirv5py/oNaQHDa1DVd4XW5lD+iy68H9KJYbqNzvUNAahmkC1P3NhcX3w9fXbgo2bTVIw+LSYiN9Ge6BsrPpEA9IMxEILFgw0g0JrKQnu6+mw2RSVD9elLD5fhM10TDcDps85izUfkvCkM3Rw3kxIPJaAKjCkUIUgPOTJGC4JgvubvXI/9pBakEn1ausxH3qgqBgUjL4Uz1t2K9rK1kp274nQQF00qYvPq8tLC0+01CrCzOIV74RzQv3L8sR1dSJyAWAoPZg8mDwBAmeChCtqTNmJUbwcDNXT+W68z/SmdntB9jV6+McLkCkyIPQGQ6D3ywY+hgwYFFyTPBZ4Nbr2YhnEBqswSfh7CHkMIjBEERoeEio/owg0CohTCSRjNu1L58tSIX5yT1aWl16YFa+SsL8q6pxkr5xlt3v7jYVRjCkavXPMeXKSwM9HSY/ND/KA0efL0L+62D5bQZ3mfsT1e3TEWafmYGe2wZDgTSVDd/2kpjgSBJ20Z6aBsMVZUCUu/rlaJ3EqX+xJU3sREhSvu+2wN6XdF3KlB2HLu6BGXZd8Ozhn916KbO1+7atSt3NZxgvsz3eJMvjHUM3/zDKPY3m2oIFGSXnLVrXAXncqX9Y8UoKQxUCCROI+PhqlONxvn7/lN9+sw8m3Q6Yypga0PkS4fol+vsrvd5RKwkTZtUpxakdubv01ceu/ye6tKyc/UAZbzmaPe3SLPVN1AGyCjXGhXnbOOFO/b3/EqtNvOkq+EE8/ZfPwqTH3hV2LPjh6h3b9JUCUEepACLyVxb3Xx/bxtqoAC5dHk0AMMiMlCTzDabc6c/jub53ydtnIJ6UsJDaphWEoAs7BvONRbGAMzjSgmej6VLOjS04/8ENoB65TTXk83WXk4WGkCDFKVorK3HTZfvtYf2HR76VoQ4ePjwYXMl/sw2BWaUgKM+39n7mkL/3kJFIuPZEVGc2illkFDaYMZ+S8mtS71GlxFrLo1axIIl8Fah8dTEF2T+gdfi0KEwYJ0idfHKzFh9iAQGAMiDyMT1ypfKXHn/MofIlThx6fvLEYe3B2HQVG0HD+ny49RssoKqBcSChG3NVVzQZX9t+KaBl46PjycYvXwtw9u76KM+6L/hB4Ku214dU68VqhErgdSkGoAEAKdULZvpmEtkYFer9hXBgSpIY7GoUWNuolFfOP+DAIBqlQuh/3NDOq8asMKqIQGTpJHVGrQbQbMm2/RMMcTp39PuRw9Vn/lB65/pZwoEgKMApB5GE3gFhAlGKs3m3Pnf7Orqql8l1JZ2dCCYq859n3DMTAQjnN4jtTZg677SSI/Jw5BAFUZMU254QtfPDB0svQ5HwZerZbYqMAaAms7+78h37HiX5srdifcwqsTKWBeffDU3OAFk0kjJUqDkFrk+P/EnaE7dBxwKMTHRmD0/tSD1ag8zeVK+giaDrb1xWdhVQHBp2QMmpfdgIb90IfKNhcrExEQjy+5e6Yrw4iLmPSVDbCmAQmjD576mmk6GnIuBINk5vHfgv3cOdO4+fPiwvRyh4S2+RvL53h1BuOt9XNpXanIi4AYFic2il2seckAgYLJqRKk2dfIcKmfemmaZ8woAHNpBSerGqlfKmB2uR0aYIAg0hhAjIQtmlkCa1Fy48Dk0LxxL1+/oFRMIjY6OUr4nPzy8s+9TygIlFVziibdm4QIMEHOtUZdCT7C/Z3/+/ePj4zsvxy3hrW662OR/Otd1Y5hQp49VGexhkDq5LbNxtSKMi3+XpggN1CVL59lV534LQBX4NAPjDgBJfeaDcWPxAdbYqoooEUQvTgReytneLKm3bjQEBYukRo6sN+Q58JUvGCz+GoD4qkjmCMzRo0d9aPyz4iQZFYgHxCyPU954AtRqQ8xKTalq356OwwefueuFAKKrrWFSjzo38K1h547/wsVOcupMSit6cUr+Wu5kVuPJzQX1uROfREPfnV7bqjA1JhffQT4GEyDXjdiZoMSQlAWccr4aN+ZO/p94fvqTLe18xV9xDB6A4chWTUSBiOOVZadNjatmOSyCBROTwCuHLtezs/zz3bui27HNoaaXEJjDDMBz2PXGaOAmamoM5gaMpnlMx2kS7ZoLjbI3FJi4eu64LNz3KujZenaj2ZqMGAD1uFk/LUlDiVpFp+tgLQE4WHiwhIZUKjPHl6Yn/w5A8yp/le8ud+wvlwtNLwm2IjAgSQMRJZAYsDBY1cSNpqdcfPPADT1jQTF44nbyM7x5Pn48QTD8Q8WenS/2nFMhNaQeJOmYTV0lxxupwsvxxDMmSyIIkbIlmGS23pg79ykAddDta9Lsx9IUTb32r1qvkIUnzXgHN679bAS53EgwZDmjSssbUpd57AwcTLJganNnv4i4cmKlfHLlKmxsDFQcxEDUEwwpMKiStvsJtsKQTwBJFrUyAAMmNo2kKj3DpWcOHeh8CUro2+qD482iosB2PzEo9/+x7d3d6bwDwVD6hbSCYd1QYGhbA8TTInRKu84q6ZWzhQepZWG39OApm1Tfl7702Hq5ccAn33C1ucSiCYWgZd0vPtsJhGT5T10DvbgY9wsQpfx3pOkaKAAR0YibcEtnvx7PT/4WrjJL5tvfDq02kFCI70xbCDgVgUuRVytnQYlAyWevNKkPR6wwTdqxt+s74FDQ9GYvW2DS4n4Q/XzUu0NjihytE3ZsaSTeZXC6aAuyoEDELGjUUZufPZXUpr+8ZudqW+HIAEt3x/WFvxHfNIaiq9pOmmoVk+VeEnhWeFiIhAgse2osNuL56fcC8T3A2NXSLsvL3FnOj5S7Iiva0FRjAKSUaRhaF6W46YeqMc1m4oMCnn3r03f8R8rR/uyaebsCQ8CYAIiCYu9TqDhATZ+FQtvI0l6OL0CagRozPUAiCNVTPHuONK79WhYyLF9zd3d358onjCkAVlf95ebS7IMhsyG9ipysyplu0ixB6Vv71YWuaqvnJ6bd0qn/ka7pkauXhUpHp2vfjjIoTA543wCTMmt7fU2XOy22+lxUCUSGnNapd7j4/XuHOgVjly5frCMwIwY4TogGfzjo2bPLceh0DQR306EMW9Q+m+fAU9NkWATNRRMvnptAE19Kr/eYxzAK3XuHXh72dP37np6ejvRtR1L9HM/cK9WpLwW+ptrWoL/RgK0t06uqh6pAkIayBgSrzuc5tvWp+8/72syr2hzdqyUwjCNQ5LCnkM+9jEP2QikRGoE2bNfeimbPeHc49k4pTIZyO4OP2t/BYay0q2xJYCgNVY96U+z7Wc33d3oRCsldx3bMzMsgUWugcWXqQRPPfxcws7R8vZPgjp7ub486cz82WygkbbUWAiBSv/CbvjZ9JgwsexG5Kk+PZEVjqwGJSMGKcUuTd8azE69HMv+1ZZt1lY9c3u7Jd+Zf4LwahiXWNOIhpbZgcbt2LnPjKaBYY9+/q7yvq7fwEgABRresYUZTlZTb+X1h184hHxQcqRgjyXUt4AkAIiM+rph6derfnJv9QprVTfMRB5/z1A5TDF6hoT5xsJvTetLhw0Hrra4e3OUb8+/yrhkzc1YR1Ctjh2gxdqoBxGhARuLK7OTimYk3wFf/Ccv9WFd/B/UO5r7dRHJTHIsImLHsT12+MlOVtN2HDBInsDnO33Bw5zNz3bnhsUMb92zz6q19SIHOLpvv+y1bHggT3+AWLlcIy6dPCxnw2KSdoxXtiAckJWJunRs2smta6U5IvaGATbz0NZ098f0pVekRYGyMAISNWuX1gNtBgUOUt98NQA63WzTMLOni/X8mCydPWfacACoqYE2gCnjlrAqeFTXR9u/MjBMErB4kDiQOLGmRVQFwAAdZss2Zib8/dNOZu9K24KsuLDQ2BkSd0d6unZ03mJw3RlWZAU+SulTM4DRMXmWGVlG/tv18VTsNpVuTkYCUud7wYsr8kq594aEjRyAbVbR59d+PqCnknx0WO/tgAsnisouD5nY8C126iMfbwr2kyCBLQq5a/VcA87hwgQDI6PHjKRLR0KsVAi/emSB43v7bDv7g+Ph4QmkJWQFwpVKZRW3mrZRUlhgKJVKh9pbcDarQbRGxUgplF2J4shAAlhNn/EKwdOH+L3CMXzp+HO6KgFGbCMyRI5CoEN1cKuWelSRNba8ByCYbb0vOEXGaRlAFE5EXLyaUfFdP8Q1RJ/aPbpCX4TVZXaWw8DoudapTFc6uUDdwqrYaE27ZcyeFKsGSAZoLqC9Mpoj3lJ2Ajx496nc+6UCvsfR85xNAwZ68ah7/rby3++Uduzu62xwh7+PFr7vZk6dCbSItRxmQCniTNEmr4CEwEFgoGShZeGIlQy6Qiq2fO/GLfvrESK02cQ7XhkaMAWjUgRt7BoP/EhR4yHsB0TLYZ0PNsa3CKfEy4I3grXN16ShH31suF5919Oj62V9e+XM8yeWG93BYfA0XyhCQYUm9aV1n0MNKBLK1wuKlXrP8YQoEIPJLF+oUL96b/vCYtpBihVL4fM6RgNUxEat60Uj6u/u7f84tut2HV3wZjiszdyWL538ItQvNyBKrphUwQNo6CKQtaSdAG1eMIOtNEQfLiQRasdVzD/6Cm773VwGNcbktI1sMFp3Hnu7BwtM8mhBc9Bi2Xdy9SP8vm2UApHC+SfmScf37u98QdOKpLZ9xHYEZYQDkKHh1WOztiW3oPTFx5voo05Yqu1utAG+qYcA+UKWkNvsZac69N3N25ZWvfKUHoF6T7/IkLCQpSwLBeE18WAy/pf/Gof3j4+PJ6Ohoq+hnXH328/XZyTdxbbYeMDwtFzUuVRYgkAqMOo2MxHlXMY3piV9w03f/WupgE3DtYH0KINp/6+C+ck+Qj12ioJBEsG5L8OV/Scu3NVnbDmviY9vRG91uija/nlfNbbUYDUz4KlvsRJJ15rRifV2vPNFShVcYcK84aunsAGJS33Tsakun04s9TgD4yJEjGNw3+EyFvsJL4kFq0UrPk2Pn4igIo/f17d/xg0ePHvUYbQ2yOhzIwsT7quceGGdJrBC7S1WyW16OYSBkeI6b4cKZ+98bT975a8CPBhgfT66hsBgA0tHTP1LuLPyYQ6MsqhAxl0mvdCkfs9USZMEIOE5iDUqa2znc9x9RxCDWsFxlkK0xLZVK/Sh1H5BcF5A4MlmSSpA1GLbXYnTlvKrlWEcSEJE0p+/UevPd2SAHjI6Ooqenp1ToKX0r59kKsloTeRApDIiEvCLyXeWe4psBFA/ffzi7t3EPwPi4/rbqhfsmInKWAN/idTHaAlCnEAVhQEih6sWQV23MJYun7/5LV1n8o1TbzV3r/hXt70epayeeWugOnxZ7USLDBgrwej4LQeGzblAAiDPdR+uUtNq06XI2tpXHSbHAIIbA246+wrPKubBrPR+GgCNSaTRukGLPvoRCtaLM8PCUPhrKGuiXhUS0bWbiFdpSXZkmYigESZOsnPvY8PD0XTh6VIGj/sKFCzQ7O7uoVp4k1iOlAiMQSVoQVIIaNQ2puaDETz34zFt/dnx8PDl06FCwvEKNyX/2U19/bmP6gfkoJCPEDi1ioxYGWT1EGARILiD2S+dp4fTd3yPV+0fhzn8hnXB/9FqO32MAslAPd3UORG/SXBKIsjIMDPxFeaRUeFLNLJTeByNOh2JoIAQokaJ1tgtMOgw+06eUFScJgBp2iUPYYYaKveUXYe9qkFW2YiM2iLr2BvmCqPf60A2AUMA1uVqpf2Vycu9yRfrYZ465Xbt25U1gnypessJWO2kItf6wsW84RPjFm555048cP348bnNYDEBn6pMnn1Cfm/xIFLJNFEmTQziyIHiE2kQI4/PiWaZPxrXz978N9cm/Bg4HuPYEkgRACgUM7TnY++qe/lJ/EjeWqbhkU5+wxYihADFcIliYrbA6po1dAWxQ3gG8894GnO8eKD4DExjEcvPiCn27CYsDP26CHEQ8EdP157MFwASVuO6S2kICTDSWJUFRQBGvJ6IDadcfMWmrCxLLMAaQQoyYJtVJI/zPwVsHfxuKnkxgfOrZzZxtPPivr5WFid8smCQgwHk28GQUDB/orIln7/9Mc+7BH6Da5K+nSbnxBNe+lTKNRjr535V67X8RauRV0tgoTShuHHGSrriwbC3iuqudPnH+U+yD+XQy5sV2QHUjdoxsJdlxvhw8M9+TH26/dwaAoLDjkKP885XDNLWlWzcx6//ucsI/qCVlbS461OPx5a0zAgMgFiMH1YoA6toHVigUxIQ0o8AAEXkSeOOkc6DjJ3fftvtdYU/pEEaWWc8ZUFe970s/62ZP/l2BqjbixAeWyCcNU5257x3VyX8bTaoXPqgpDPR6sG4TAC0NlfoHdvfeUuqLhpquIcREKZ6lZVYu0QBIgOVA1XMhXjT/PeTok8YyKdSvFYwNjQgR2BhuuLqPyubgwI78IQARRjOIEgDA8q1BsQcexm8Jw3UFCaNNo2oSMMsng2Ku0BL1w5XDBMB19HXVyFAgokrtwGdq9VlSVpBLk+WqQjHFrtCX/65dNwz+MI7BaTuXGMa4evprr6tNfvOTpfi8wdwDSf3CA7/XPP/AGIALK9r3+lRcich35AtPHtrd952JJOpEaaVHvQWF3di8ZCUBT8zkE3mfX/SfnJ2aP6G6zRbgtNEYXhyZnHC5q/QCAD04mi4yA4AXX9KoEKs+hONwiETFUbNeuSepnv8G0lyKjo+POwAmjhuvERVwajCxCgvStsVSRnEGK5FXb5oSG1PkNw8dGvoQEUUrYcERBZAk0/e9unb+xJPiyRNP0Ln7fyKrCxGuXze/ASCmpM/q2V/6TybHuxLvQMyMNRtjowgjzfCLGkvkEtQX5mvjHejoIhfWxatAYbezuRUKMtDEN1DuyT2pZ2fetGSOAcDa8huJw0hUr8jhTTOmHoDPqqG0CYAhM2utYibDsG8mQVx5PgDG0aNtqLoxpRADIg5GicACYZemnDSDjKa9utAM+KwEEFnyEGpQ3XTsLI3ufPKOvwUwdOjQoSAzdQSgVp07/404XroXKyboejlwBEAL/YWh/h2lN5X6+FXNZMmnpUST3XzqPpGsmKa1XZmECEqJsvEUL5hzbj74ArAIG/AgMQkRQWUtA/r6LkaG+IF1gREHuMjfFnRFTyVC0BIY4ziskw0eGsWiy4EtqWi9u+Beu/Y1e/e+LwTDt2gutg5DXHHhmq6RdA50vOSGw/s+dm7h3ACOwY2OZqhoLOv+6z6xfmRkhPMh3bLv4I4napB40bXYo0vfKzNALGrZIq77arKYzBVLJWYyhrPqNfH2FAGDoKJiLJsgND8KQDAG4s6+4afkQvMMZaOqep2GcGfqNUvspKxPJC6uu/PnF3ejNXwh1QLwkb9dve4gJgfautlMAUbUKucHtaTqw87gKV17Or7Ysb/01qzA5nEVJkhczl45fPiwPXbsWLTzpoE3BCV+WiOptXqPt+dyqAMpMVxAS/P1ry0uLj4wWanUc6XgcwBlMqPbUHqUhZVeKAD1D3YtlvvK+8eOjIFrCzUlG1gYm62YXrIetNUaxkZUqGkGOUv8iYIEYsAcBuHXuos8nBbPDxscg+/q6tob5HMvZ8sMAbcipEtCEInA1FIdKYhKDUxdGkJFGh7aN/hr+5+8580dHdEBXL3xtNsyReMnT0Y7Dnb9Sqkn/JG6r3lDZNcu/6WhloCoU2sCdQ17obLY+J2RERCAamEg+qaqMtbDqGxBaEjJOJdACSNxEidHcEQ4EdkhJoRP6Qq3bL2vRoTU5vgrA0iczATc/BLGxhjj435sbIxEZKlYzp0wxkCheqlHuhoklFbEWBlGGKQGxMyJc5KQT6Le3O917Ov9k2Jv9MLLKMZcibCgpwcdQ53N79t7aPi7vI3V+4SMppyA28a5KMRynptL+n+m71u4CxgBADQWatFKYLhteQYYEDjkCoHt6Su/GEDAuXLpRVGUn3fSyhduXVguv81El4MVJoXJpprEsZs8O9c4hY98xACQT3/607y4uDjbcDGnrNoXX9+GiDJdiZ9ICawGRhmsDAvLKhLUUHHRkH3+wMH+XyyX8886hOVSwrUUGgYUzkXP2X3j8Pdx3u9ooi5EzOQCQLYfqBprycVonjk7fQZAo1I5RgDQ9F6BdLzPdmwcr3R9kVfv2VJXvsgWgGcnQbe3xZwFq4GkwdslOgIuCsKW8SRbhDGAlxvBRBlewSQeHC88G0AB4+MeAA1kM54b9cbrvPj02V9idtFqlvAM+0K60oqhrUoqg4ht4hKJStGLBp408Gen993/mgMHejquodAYAL5YpEN7n97/llwvP6PRrIlRYwicZcB03YfYam9RpLDM5bQlqTfGUlzzdyQz/oOqKqWM3syooVVJzq00FGavFcrWzYG8kygsFG7rGig+kZ3jBxzncwQh3mIbz8X06uvnCDYG79DKfF4QlAypepBr3AYgt7Z0YgJT3cy32hgj3J5Z8Fm4nSX6SEFqEGjEceLElM3NPTv7fr9B9KMACleTqnT5chTSA3TsfMLQ60pD0YsrjQVJa9BphK/sN0nQSdbySln6TEDk0yy3RnTh9PQ/L1xYeJCIaGAgXaxcV9jgjOaWsFVwBGWI5vQ5WRtptVaHZ3fz/IXqXZzr6P50Ftxf54pje+U0E0Dv6utJXgpNpGuSec7MFicN53OFqK9rT89bBm7u+RmsAKGvxroQRmCI0JG/tfNX+/d0/axzSWqGtsY23db2qhDyECNwELFBYOoL/t7TX1t4x9jYGADo0aOQHvR0LJ2Jn6Yp49FW5aWV6IUqgTmAiwWJS1AsF0u7dg3ebK3U3+bYxoBG109WVvc2aysjtAmy6VoV0DUzUcxkYpdoEmKoZ2fn2w38wuTRhd9d7qy70hHCx+DKg+Z5/fs73+xyNfi6bGtrpTiklKYAJFAomI3AW7lwdvYPANSPHz/SIinQXE472fOTRUWY2G7Vj2k9D2IGq8VSpUJEgXp1/TGS17CIdhOIBbJck9jKbl3bPbjR69f39rV9d2e4Gg8QwvV2tHMp5OJK61e0kc1uu5XYOXHWS/dw9+8M3dz5k1AUlwcfXd5XGlWV3j2577npKXv+vNBtpBHX5SIHfZPZksujlVtymxIySMEWbX06ufPUfbNfAsBHj67cSYNIwb5GRBC5OOve/qzXXjERYMiiWXcQDxZVNHzjBldyn2fv6BlgBNstMV9RWE3pUAXKvARiTqXV2n8EsJQh7ZYvSLwPrgfagkCwajnxnpqh9x3DXb89cKDnLSCUsDLJdVvJDAL54Vt6X7vr0NDbc72mq15vINCQt7uGmfue/icigbFqfXhq4Uz1Nw7fjC+tODrQ0dFRM1ufnVlqVrpTR1u3lcEmJkAZjWoMw1GqcQLWmw/sneHUA9weVekVj/R1ThE3BFn0AhWFEijqOAkgyfqQ2lZep69XeYfFgMlQLJ4lgvTs6npT/77ON3bs6ugBtuzTEMZABJKePbn/2jVc+PVcrz1QiZfEsGH29jLWr0VALBDvNeS8mT1TGT93evqL4+OrSxr3338/A6h3dhdDQImYN8n0rkbipe0nBrVaE7JCekxkqDE3Wf0OBlkmDTLveGV4w0obCQPK6w6tSu3i9h4ks4GpLJI7dy9bqjtnCCwODIZE3Rd/2DAKnfnyJ1mxIUPBerDPjSIoysYdpwMz2mIQ1WyQvYCEEGpArinQkIcKu8tvcS7+d9gaU1N6cUdICjvoLT37O366eyh/U9KoiiGwhyDJOIy3GuYSpVgfowGInEQ5a2qLNHHygdl/bC5i7dALHh8fd4W+4Glg7kz5AZUuFs4sfBaXFjjJA+TBzIidotZogoyBsmQYZxU22pexSet2FMwaP2cbalVViUmN1Tlfmf4jTeJzlgIAFsqAS5aeCMDg9tsFSIkAe7RnX6PafK74tPPqasyy3uqONmw4SRKXK+YGd9w09F1hH24aHR3dzJ9pQRlpaGfxdftu3vGWnsGyjeOaT9l7Lz+ZrCxIOFZDhoM47yZPTH3mxsFb3rOOaUhjKpJ9XvyTNjOlIoJlv0CRTp5hg2q1BmLGqhEAKuy8O8cgvxKpXGsfgYhUBLBC4OanfWXhKyFIFcxO1TO550eFjpfgyJH0JkdhjDcnE3FfIyJKCaq2N5LvUg77pXQFEdmkmSRhR/iyvr0Df3z06FE/MjLCGwZ/gO/dbw/vPjz0Sx3D0UDi6qzkTcsvIG2xLmxTYEgg1vnIlJtzp+vvcbPuZ8ZvGF9LrNTC8RhTiO6H0WERWdeMpvCTFVYtlTSMrlabcImAyUBEkaXmBEC+7uueDWWiL5tpi612Lm6sjdoCROe97zI2V/ELs8eMaxAxi6iQjfKpjWrrKJyamqqQob/xqktZple3KiDrNaiv17C+0e5r+31QjatJeaD4glued+CVx44dc22Qz2WVQYSOwf3Ft+89uOtjKMZPrsUVVhJqzaVsBzNuZSblKq0okFJYtrOTjS/d+bmzv3FhqnoeWVR0+PDhYGhn/+uyiSUKwHSUc68PCrbSipDWFoKXhSXtVIQNcnAOaNQTWBOmwk0ZpW7WdRkYe4jBygoBm+vA0Z9WDy1scTawdrqxcN+7XX36HmOIRJTCqNSMyl3fBiAA4JHCDwhVux/AFADOQM2XZZK2S+u16v1CxokXDfR/jnz/9+dwDA7trcbDKOx9Ys+v7r51cMyW0NtoNISZCZTyyUADkHLmO20PSaGiPh8V2C+YL1x4cOF3Dx8ens1oJgiAnpq8/+mWXOX06dP10VGYjg6UOIceZdejon5FoFeClXYOZKKUvWJxoQqmANreQd2mRIipwd6at4qI0+sUt6qqki0VLQc/CkBrMycDQmwMjCOlLk/hs5ASIi9rmqRevzdJ4mIrp3AlPsxlF4HUsm+qcojhB7/5D58A0EOAZJrGl5Lct5hO+nF0OFf3dQkQMUnmn5HFCqfL9nKAIio2ZFNbbPr77zj9rqkHFv5qfHyyRTsrAJCP8s8pdXYFAHD0Qyq6CCqWizvVXFzeaJ/hIBkqkoixMJ8OvE2Ho7X7Wbo64m7UpRpoYgVOhNcQk+pK3WUjM9T6Qmyp9EKAisBwVDdFBtBQl3wPNWfeFwYwCYeIOvr+vrOzsyvD9DIAmpysVOHsV5FSbmirc+9SfXQbqf31KtwXJ7bWOMkqYIapJ80k7LQvGHxi51u0G52opMm5ynTjc1OT87+WLHkbGk6Ld0rZY9XltVTKsEAb1uVMWixhAchpLgjYJrmZqQeX3u/ruU9nLcDLzu2OW3b0NtEYrJSTT2EMDCY1u8PnhTm+TUU15TniNlOUPSdWGMsgCrC4GMN7BjFB4DJgmyzP2EzXmdOhp4gbzzc+BjOprptm0EsLwTbqdKpiiFWDfP6VAIaxNPG52vSd70M8vwRj4Dy+18RxEUePegCaDlFYmpdE72AKFIZ9WnWWLJlFuJrch5vYJCg8JOUt9b39XaPIIcE4EgA6Nga3dL//hWRB35mzESk5p5Rx3i8PHWv9R5vWtsgQRLwENhCr+ZmT35z9vVP/Nv+fZ2Zmzmbo/eVqej1ZujkR1700uRThCAgKSwGNBHm7U3zqyq40+snys0o3eYCFhTqcA9gEK33Q7QXPtqSmcz5kw15JYrQN+LrmdglgMYUuj/zQ8wCQS9xi/fwDccQeVOzUWe0ymYco4+PjAsAn1fgLiIVIyLbuX5cLl3RVzM6lUq1pNoQ4cQ5BPrzp4O59vwSgNDYGHDkCGsWombj3/N82KzQVmdBARbBB/mOjuQfEHqqJhhwBzcjc/41zf3T6+Oy7ALQ4/trm9aFjx1Dv9+3Y2W8WJhbmx8bGFEDHrh39cRAa8d4xyC9XulewAgyVCAtzDbgEYDIbOOSrI0oRP8nqml9KmpUmtbifrnloDfKiMPnOPhsU3wggh4Xpr/j63J80Z04hsPagjXK/kor6iG3lEZKpxjFN9BwTs2a1dVpjfi7Xv9lGpj+188RcjxvgiH+qf3//Sz/96RHGCOgojvrmol9cmGr+q6UQKroln2qVM+q9RBQQu5w88M3z//f0nXO/C9AcLp5b4Pfc3PuqYiF4cTNu/BMAevvbj2h3f+7WXCn3LQLHCpFUWHwrNgdROoF3Ya4G8QbGhMuCoRvTABoFXC6f+zJL49y7xDUmDBteO3lvvazq2qLZVqrBF71OxXiTd7bU/6Igt+vVANhXL/x8vDD5jxYJmXL3IXR2drUYv0dHR3l2dnbRgv6OQCn76Yqa2VZler0s8JZzMyugcnKSOMojyHeFL7rjjjt6kGJQjOvFnYsz1b91dZdYw7TevMn1nVCCiEjeFpkb0eypu8//r3PHl14H4HyGYJVlJwcg241ndwxGPxe7Zu6eO858mIiUCODA5CjAjc4nQAbmTc1P6q+4hLC4UIcKg8hkfk1W19P1XYu0TcUncPwUzpd7nmoQRyRpgHVdjBIhnS3UMahq6CUABAcORG5u6rvqc+f/JJfPP6nHmGJLu1xIa0vkRT9q2Kajx67ziD6lNZrGgBJKKNcVPrPYk3uWfihzVk6jPjdf/2zS9McMES3PDF7HV0nXglvq3gehYWnw7MSd0+86c+fim9vM0MpGHktdt86B8CfKQ8UnTl9YrAFY/OVfVsYu5Dp3dnTYHO2KfSzEYAJDPYEpQJIIFhZqgNps46flgLQkpMAm04A1rXnm2EbJnAbmg1AlAsnqB7Eeku7KH1TqCypTvoSg3HdLGPbeghOdAlSmq5Nn3+8a9QdNx/CLWuJ+7NgxAaCLs3Nfd3GyxIa4hfiiyzItl3PNKyn0lPGEjPPew/LTgrJ9Rk8PdYym/cccN8LZC2cWCkQWraTdair/dFB7WrvyEPVSyJVMc0nn7rvzzDuXTsy/C0BlHTNEu96LqLADTz34pB19pLJYrzXfBYCPHIFGS9FgMR99H0hMqtpS0go2ARoNh6XFOpgsiGyGA1rhikl9mxWkFWk6TwGagVsFBQndB3hpeume+szsk+Dr6bzAjC41pUzNTl3pslNdO/dwawmzVQVIEAJ17EmUe/c+x4U9HwHGBRg1cOeOVU99+RZp1nd2DuzZvyyhY+CpE1NzGruPW0PwEMn6mTYMpVd2DC/Tq6ZJqsuoQaU6DoQkTb6JBTyTQhB15l5fibHr6FF4jIBRqUw3K/6rLk4pdRUuI/kxacqUFCQGXj0Savp8Icemnv+Xk1+af6meqP32ArCez2JVgVkXfOfA3p7P5PPRi8+fmL5rZrb+wdYaRWV5bthhn52oU2OZAw6garGwUEe1GoNNlLbbUFZDUsqsHWcdPz5NB0BhvIGR9BJEvSJhXTgf72UA0KTxgDSqYCbodVD1mhEtihCZqOSjrv5hhOUDGVmPAYCZyfv/28KFk/cvQ0GOQAE0lmaWPoMYiYFNnV88dEOHiYi9dxoV7P6+3QO3AbAj2a9MEvyVJPoNw4YIaUeVZjtXASSmCUB9iTtN/bxMffGfvvYLs+cXvzilqOLi3m4G4KiA4d037njxngPDsrjQWJybrn4EC6i2iJOGd/cdjoo86OG9qqG4LlhcXIL3HkEQbGodljd2W1UqA594w4YjG90ZunBfCuQx5kua1MFIcSnXRWCyyl7sPOe6B6OgOPylqHPPDeldjVgApqdn6NaBgZ23tW5hdBTN2ftm39uoJHcEHJJqWox8KA9V78l6zZfCl3Z2dpaBEWAMFFD5nrmZpTmrhlSRZuiXCe4VnhLJBQWTzGLyvq+f+t7GPD6TKd/1qs8CoDB0oPPN5aHwextxo2Pq7EKjVsWnAMT5fF6HDw8Xevo7n+u1Ae8c1WsetWqKxmAOsDqA3MQRX8bLpibLq4dhC5f4areY96asQi6+SxsLVYZwuvlp04nx62Fj1kYDm0VJskyOI/AKchRR1Lu33BR+b7o4twsAmZ09d2++aU+23nY0/bOuDX07Jbxsby89M1K3VCjdLFOccZOuEzWycZqwiTCCCN3Hjh3zOAI5ffr0fGOh2QNPSqBMECTbs5BCUCC3pCfu+crpH12c9P+QlRhkHWExhw8f7tx1sPdNO2/s/QGEsfjYx/Ul/Vh3zn0VGOPx0+Nhf6H8Exzy05txIvVGbJIYIAqWzc3a4udGtSWilAEj9a9S0mcjBNfw5+5aOpu6xK5+7qvaWPLqE17GSVzzjIbAqMCA4YSJir0Sdg3fjsLQyzMqDgbgJhYm5pffeBR+ZGTEnv3m2U/C4w+sDY0XcQ+phgHgVTQshKVcZ/gCAIrDCABUm0njryVRIiKf5QIgohJxxHYpV528d+5Pl+L4XzECm811XH2kXQvum6e/8h19ezrfTAGGvHM+aahvVP2/TE6iBrxDwgR7wiLe0PQJLVWdJt5mvppkfgqtKyyt57xqE+iaSI7S3A0lmO2MOvcyMGoOHDjAPq7dlcRNgFiudchKmvL4s6YsmAqmWBiF3p1S7Bl8N5Ypxi6O8bKIiaanqr8Rx0ndGL5W5MpbTkSKqADU29HdMYwChkZKWTY2oYo6nLfGsmY87cYyCGapOS1vMPXSe7CI2UxY1t6DwVF4042X7rllx1ujrnCXi8UzjJ2dWvyH5nTlEwAo35PbdeMtQ68N8njC3PyiigaGNFjOr2xWttkKqCyF0FKt0ax/ZGF64RsMHNUT994bR0Q/gLh6D0PJM4vnlYkyCrNM07neOLyVE1s602iNIVkfcVa/4KZY4u4bdtihp/wjUD6I9SeeCkZg5u47e6o6W323ZWs8vFPRjD0y8/gvQ4bWK1au/JtWD7TQtihDiISBRJMXoYb5228fk9HRUZ472fgNQ7hXLLGQVfWJFEzEi+eaf/6Vz5/4u9OnT8+uU75uofZ8eV948Jan7v7TjoHCjbXmIlkWSuaoWjnb/ONGA6dUFVKt27Bc/O65epWJDQzxSoMgtj5uebkYm4KO4I2DsGpAOebELKoECwBcGje9/e1UqZx8UBanHSPhtLJKW5tcuoUBm+uLd3uSSDK2WaaYcibfu/uFpnfnhwCUsA59OY7BYRRm9q7pn6vO1j4SmSiAwKWsEKmoXJO+vFW32srLpAhhJw6FYlTYvXv3jUdwBB/60IcEBQwvzFcHlURFVQthxLXp2mcnPjv/9gMHDkRttaH2hVYAGvXiW/feMPSJjr78UL1Z8WwVhg1V59xR1OTrAJiISrtv2/3jnvmJiYdjY3hlY9MmubQtgAqoNSHSSlJPClNnp2ax3Pl95AgBqLm4NmviWpq1yPI+K42TVzUcXbfwZtKyAQvnksLwjbeFO578VaB8Uyo0o6uF5igUY9CFUwtviuf8Z0MbGWXX9Jyo0PXlXiMiEvFQpsGar92AIxAi0gCdQ9aGXyA4ithAalQ9c//0b1ZRvXDixIlkndBZ0Yuy7bBPv/W2A79Q6srtrtQrXknJmMA0anpu9uzCe+fnGxMApGtP7lXFweKPOCRCCrMCX7jyxGoGI/WGmUD099bYqZGREduaNZDmlVz1z1x1WkJuleWBy+Ha2U7T9xroA4gIMdkg5pLk+/ffGAzu+SRQeEpbjmZFLR2B1mfrp+fvm311dbZ6V2jDKM1citBmtazLuN7NUU7pw058fAMHGuzCrjzGwElt550NacywEgKEdvZc9cOLC/FX2jAt7cIihw4dKvWWC286eHjH+6Nu88JqXCEyMASCOnYzpxY/MrdUuXt0dNQM7h58ws4DO1/RDGqdTddQykDPVysqYRDIE5MnalSad9Vn62cGBgZabEfpvJ8baqc/kFRnp1li5gxQ2d55t7F9101C7S0WJFtWNwtfHQw3vfGlgf17cjtuHkdh8BWZeWr3axSAWVpampmcmHxNspD8VM4XkoAsi6jX9NjWNW8lU33x5wBePdnQNKJC7nmnS6dL9A4IcDwuRPZ4ZPKozbnJ8w8s/GpjDiczLK6sFZbZ5vkfG9rf/18K3eEtlcaiCAn5RDSkiBpzycnajPvLsbeMzX70o0d7+3d2vMjk8N31ek05Jc+5etzKmlK/GDZQh4WF2cWzSMcPtXewjdgTQOzj6j9IHBPA153vrSU0RgUWCg9jGpoT23cDlXYd/Ah37v97ILe7LYKiZR9nCXefGj/zB27G/zfrgzuDyBpKB2z7a4mTIQAm3V4QkpSHse2Iq/WIndE48d9dmY2/ObKSb1ktLMn5N/bu6/rpqCscrjZrXg04HX4ciotZZ84u/l7BdPzzkSNHJOrvehl3u7c2fUUDDVL0wtW+RS9ijOFGo35P0pC/H8uKnm2mPp1o4l39/3O1mZnAwAqCLO933ehqs1UUsAiYGA6WGxKSFod9565DLy8O3PS3Jhq8PV305bRkKkCHoRPfnHjH5P2Tv780s/TPRszZyIYm0wey4gyvFBLbGm8uKzpPC5Fpv7OIMAxOo4JYsvkZvmFeWJ91d937z6fvGBsb42Mr+RYCIAcP9pYrOvvGvj2dbwmKGGo0a8LERoWgCrGWTW2u+YkL9yy9r6Ojw+e7wlf17Or4wZgaw149WFuxzdV6Amk7gZAwBLo0W8upKB85knHOrLl3QlK7r1yOToXl4RfXpBCRelhKSJexE1lyny7O9LR+tnZDrxfCrevTUCtATyu5KU9deorz7Dlwptw5RMb+e7BhafzUlwE0Uoe4nzE5IQAkXorvqJ6r/anl4M6Ag/1hGOwGK4uIUOYbtpy75eul1vhAXve6N9ZS1BIaH3IQNBebn1m6UP3k//rCgWj2xKwfGtx1e3Wm+U3D0bGPfvSjrbE5DEAPHeovLRp9Y3lH9NNRiYZco+4tsUkn+xg1gSepuaUL91V/qbEUf3VqasofePKun8x1h6+ru9gp2KhujJS8HCeYiCDkVAIFJ3bBnXb/eW5q8UutCM5clCwCxMXcrbb0vZTrCFSFCP6iuGPDh76NKGk7P1NiiDJ7MMJih4ny5WcE+e7niZjdEn/uGDDRjnUljMLULtRO1k/rp0IbfjHMBZ1hwDcyNUk08cKc1fJXqm0t8sStXnN73lpJJGDL8WLywNJU9e960GNnZ2c9h7itWa/fNXV+bnxNIrLgIvMfe3d3vSUsmKFm3BS21oAANR6i3uWobJZmkrec+eb0J8Iydt381Bu+J9eT/4m6r1shMQBdknRz2wIDgqhIEITsKvrlxTONX282m83lkvk6GpYCyp9ozp1tFIp9+SYMPNsUsnSVwrbLOdL5ewyFpUbi1ZjOgu3peFEh3/GipNr1rHpl6W+xcPYYEN+Dw4cDHC0pcKzZxML9pxcW7gfw8Z237XxlIS+/nCsENzYkBVqDUwQTX1HeRpd5kYj1LgDo7OwUACaO9d/yRj+/pgIdFIbM7f17u94SFsxgM2l4MmycAGwBj6YrRsUgnpMP3PfFs38AAIO7ug6aDnpnXWvwlPYNtzArehWHw2VgRrZxoJW5xfuste6i1MfqOx+xzv3bgiAIojD/Ys6VJVEwrSMs26KryN6/1RB3VSsLAKPJckYZGeTOC0SCPJlC30GbL/87mys+i8Hn/YP3fBOYSPs8jnzaYmwCowOjzc//0+e/WlmsfDyfKxUMmwNhmMuJpBzZywmvDXqfNrvXjEFbAzYcV5KPLU1VP3/zzZM8MQHp7ug+PTk5s9hSRYcOHQrqZuHGgX3df1XqyQ/FrilgmJYn4uElMMYESfjlM/fN/dfaXOPU6Oi39Ug5fm8VjV2JOFFKe+HoEtRSl7rm9tLACu5HYY1VrXBt/szSO+am5o+3Z6PXIXKeyOJaOg51rw87eguOAk7BCJcvMNulCCEiMPPyEKkVmvQ0kZgiaoidMsWwnm3kw0Jpd67Y8dJc50BP3DTD+os/9XVgwuPYGB0/PkUYO07+HzC9cH7pE9aaLwZhbtiG4Y1K4lQ9uA2Nta17JYKSUsiWurq7f+7ciQvnJ/4DgGPQSqWStFVFJOZ4z8C+3vcU+qPbGnHdE7NpwTRJocQiOVNsTp+qvG3yrpm/f94rntc9687/Q03rz2o4LwQyDLOKtPpydGP75m2/N2FxuSAyWpWfO333hT8fGRnhiYkJv5GGaft5XGWysxJ2vpoKnYB4vhKBuTwnLBVsUYVnhqSD7JYxNQLOhgV7FoWJYdSbfB5R+blBufs1UVR4LhGf882P3AccVxxLafQxCqn9a/3E3NTcHbmO4iIHPGIskYgXyjjWt3OvLY7+gAx1ROV3nb5nchq3g7LvW/6I8o5yT9/u7lcXeu2P1KVJzMwQJdNCP6hKIR/Z+lzzN+/7wrk/PPCUoR6Tb368YipPX3LOWTWWlWHULHtrSrgsoVnbZ57N3VQTMLnYLZx7YOqnm4t+dmJiYpW9M5s8KZZCz4Q2my8ulMo7YpMT0pSTkdWlSHNt0USkDL8thMp6Jah2U8S6em7kynuXtcfyIDXKIrKW8m3BUKntu5YLn2nlWEUgaiKx+Y4DnO/+9y7oebaqOYibdn0WU1MJjmc5HI8pe47vSAK/VCjkD1qLTu/Jp5RYrfGAACtnDsg6TJ3Zf0pCTBwvTtXOzNcWjuMTqLetgAGAjoGOWzv6cn8hxuUy1BGlVKoCCEloI1OZbP7bA189++vlPaWXlYdK7/c2OdRMnDewlrVtLVOnMrsRs7ocnNW6Vnekrj4p+71CoUxQJnioRjbHzWl3p9aDP6st1Cpri6NmYy/usEXz7qpRtjDBK1Ho8urZGJgUo0oKIbOqUW49vrR1Hdh1iu6rGR7a44+LT2xQtG/FK6mOV3aiXk2IfKF8UxQEL7ALlV25MLoQN5ZOthz+xlgjrv919TPWUBJFuaeZMOgQ7x0InE6upmVqhlZB7uIaGEPIw3KQxEvJvy7OL92B5rLAUEut3/ikXf+T8/qEhmt6JsvL3LNeJLQRNyvJnQ/eMfX9O24ayvXv6flNDeXGhnfekjEshFUNfMsmHtgI6b855Xzms2S7VyWd98A+aE49OPcXc6fmPrZeXWiTYRSTAozYHX7x63O+9pKw1LvHmpx3KiykKXZ4TcpoywKzQkyyqcBcCUgl+yyGKnlRH+SLLowKT489viVxVIOrfAU4bHFsUjAKk58uHK/PJRWwPjEqRN2qIhl0Hq0eP9qgwzIjtVZSDuq1yk9WTzUebOVaRkdhPvrRCb/nScM/UujKvaXqa44MLDKzQgACDgAHOvPApMv3h8WBPX1vjbV5Q+KdB8OQzxAPtJ5PeLkC0xrclfmGqpIPQlObrf3bhfuXfgUiZ9eppuMS00smsIjFBJT/LBQ/nC92sAeTcGvaAa2YiPWEZYMLZtAmid6r0MbSJnzpaF3LTskoBd7mu4eZze0uTsbhT5wARiyOT0h9pt58xsK3jH/dff1vOwrlm2xob/JePLjFMMrLUdQ6/oCYgNmIue/UyXPvxE+jnvkv9IQnjNLU0tQNxf7c/5bA5RxlmE212XsBQ0y1SgOhDctdg53fEnPSlfhEYMi0QufWjPD1o0y6qJPykr6iZlScLGBAA1iws9ML5xeOVKfrn8LFXQtbEZgshpXKlHjcaIPoaTZf1lhSkhzISv7i4SkwGRg0Y8RRYhZiyRWKhSAMvi9uyINw3/hKZp50AhOCGmabzfifCoXiy8JcMOid98RpP8XGxEUqbAxrQvfoJD7ceFZjEcdAGAWf/NjJ7p59nb8WdQfPaviGMMGwEFao4gHnFcYY5PN5OIhP1IGYmFu9Qau0yeUlRtdNHbWY0QVatCWuTTePnp+Y/mtJcAEb8JJsCTaiOmJ/uTH5Q7XZ0/f5uM7M7FrO4MP5oDY8D5MHkwep57qDoDDoy4N7/tTmB54FoD05Zeoz9bONWuPlviFzgQlZXTvT6HprnzaBeee/PD8/Pzl6fJQyzI4vDhafFJbDlzakoWDldLKKAcEB2TB5NYAEhAbFAJMxMMzCYNkaaScRL6cgtpOia2nHwEZIGnLv5JnZt8ZVvRObjDDcyhNXYECPAGrJv7kxfbpmtWlZW5i2rLFtFVmLYC2d57U7txaccxu2R4m5LsRUGkDYu+cTnNvx3b29B0vLhcwR2HPfPDcxMzX7FhYjxpKnjP2A1hQslQQeygyGcWzCUnjD0ZSqBEEnnlbuL3wfAhnw3knmk6dR1VrYCNKpA5r5F7QmNNBV+Nw1INk1fD1bUgK07DwLKfH01Mz/W5uqnaMRMpst7BZVRApeai5OfNwtnjzCS+erAXl1UAilE+VVlnl+MuIcD1JZ91wZsSWrY+tl2ldpm5CyvvBtNEFldf0ps+/Ky/hbJQMiARlQXQ2oa1dHvm/ogzMzJzuWsTbH4A4fPhws3L/wp41K/IdhZAKhxCFr1SDNkgCkUPLKBspilnxTPhpX4vszgJTky9EA5/AqEacM4rQjPOsuzK6JBbBKMAIYbTF9Z5ELtXHn6sYo6S0LyTK+CRBSCEFzNmerM5XjFx6Y+xpwUe7ocgUmRUgAsIg731mfOfknFC9WAgsnYuDJwmeDO0E+Y4s0V8UX0asJDGrXOFk53ItI0NVf7d578N8jivZnQsPj4+Pu8GEEpx6Y+CWp0z9ZjqyHiGdNeWtbgigGhgyr08X5qaWvAYhHMQoAGLxhJ9vQ9jjnhcFEQlcrDrxCfJRC4H1ojHJsPlM71/yhQ/vxlbbnvOFhtv1dmHUR2ztd7J+RK3XcqMglChiwWxnPAps6tqSX4ZStDymgbVeRN4i01/xQUnxlZIx9cdzUW7Ux94GWHZichKCEIPT5ICzaFzsWk8JdabnhixQSBgG7moxPn575lCQytbi4mBsYGCig7H8BgT5BoaKSZv+WYwHd4N5o481zpWuw6j1GNEBoZh6Y+8D0xMJfTk0h2cr7LkcNsHONee/d16H+cL7YtVvEK7OSZN0GTMtd/5cBR1ofQ7MRvmZtAa3dll/8s7VpKwDEJKJKQQQVHTTa/Esf12aWo4RXwlf+Zekrxb7Ck/PF3CHnvCfOFJQyGCSGDbta/LuzffOfwM3gxa8vJqZEP5zriX7IweVTerwU/qfU8lO2LjDtdbjLhZW0rwURSSHIcWO+8e75c0sfjmvufmyRrfFywpzUzicLX2mev/Pl9an7vpY3ibKIJ23NCPe4XhN9t+vsrXh8qW+XTmgzFCekUcdgaPKdv49SqW/58R2FgpAsTVV/2jo7GaZQD21xqxDD+qZP6lX3jxhHMnpsVAuFwmDYbQco1F4PLyk8u8WUADwUBAJtQueCwJJU6OP3f+Hcm6tTjX/BNga7X25c7LOG+anmwuR76jNnOCBiEk5jRBLodYYEbwU6sbq6vBJ7k2q2401U6uzfC6AfK2AsGXnBiF04ufBAcyF+d8gBZ5PGoRBPRtUnbnx+cr6CMfBRPSrG1BJj6YVC0sqQQZWwKj30UHguqhqEga0u1eon7zr7d8PDQwVNrcyWJfgKEinHUmLj5oX3NOZP3d5cPFMNrReoCCQAXJBF3B6kCSAuHVoivBLetnHNtKKh9hCxxcZ9qWo2VKDis8Ll6jMdSCYrfYDZbCaCz4qZWamTQLGIJmH/Lpvf+b8AtKImOnbsmAdgpidnP9GMaRKBNcxeCASDAmkFn+4v958fPT6aQmKLHd8S5O0AHGAlACRj4FRJxy77jTltNuu+XLs5Vs7V67gcQWatQmoEwl6sJYp8dHfjQvxfK7b+Z5OTkzVss4fIXLHYAhau9oBLpEGGX5bLF+GVIcrp4i2HiViuL68QEeklZ09vrS6il9Q4W0iXp7GPCUPLntXX75PmK74JHE/V9ciIad55z+ny7m4JIvP/eGkKwzISuxAvxD9w5sEzs8fzxy0m4cPBsL/Ykf+ZNAjPWgo2ceg3q79txdSuKcut/h5WiIpaY9lKsHRhYu7PZJZ/u36hXgW2P2nuaqRqHTBiUT/3O80LE2+KF85UAkoE7Hw6n5AgMFCYTDl7bHcu03pa5tLa57LMGiXee5vr6OOg4z9m+af0SzISgOr9sx/XmiOIIRNYFp8cPXPizOnDhw8HuAOut7e33Fko7WNjW9mUqw5r3ep9p/xAogEZWBfIhZNzn1uYq7x3Zmamsl5h8XpomFaRUgAE8JUvuoarUWBfnssXWFXSdIWm0QFrq+2WtnWl681HWnbi1oTMa6GH23kI6biUtHJkoPsSB4tk6R/RsvOj4OieKG9Ltm7zwQusmmblwtKfV2dqX5ucnPSjx0dpYmLCak5/IuyIbtN0Pucy0HzDsXlbqPBvpm2prQa3KnEpotYYMhL4+bNLX6jNV3+8fiG+Z6PC4vXSMK0jAQ6FiC+8s7l4+ufjuZMXImqq1US4xfa+PBT0oU5dbfa8BLEHUbFXTL7zF1EYPrzsAB8F5ufnJ+am5j5oEDbIBV/fVdrzHozCAfAXLlygqampShAaECsLrgdF+YYbQAIbqnVhc2Gy+qfVqcr3V87FxzPhv+zrusrVw+MxAEsLZ36jMXfqP9TOT0jEyulQphXy9IsJCx4mwkJocaqQQ6j57sEaBeY71iwwVRebedeQnCb04fHx8WTkwsiqmygUCw/ZpiAQRFQ4YBavPD9Ze//M9OKvL041T2TCckXhq7kG15zlaWr3+Lp81rnkBbl8qQfMzglYWsBuRRa9eKzh4ltjJi6RDYZe5PC1/q0boAHXg063/sWtYQwCCoyxVvz+xOGf8ZqXncPx46m0N2XKFgJuVqr/UJurnZqYmFAA2LdvH09MTEjf3t5vF+OeolDJ5t9c7MxuwSStNUOtqvjql2WJUlJ4FiiLCzk0aPDczLnZX6A5+aOF89UHr8QMtR/2Ggl6xrQw84/J3MwTa0nzQ/n+Pa+gQndS92pFQUweyKj4U73DGzh3tMwmsCansG5dZkvdirpW6LL/Zw21BIbCUOIFUbl3l6ktfsAf/cRzAcxnL09m7jn/i+tKMADvfQpdUJ9Wnak9atO1ueaLNMRG2kkppSCjZQR0irrQlDZPleHCIApkHqeWTjXfODtR/WjbLV4V83gtAS2t5F4tqUz+yNLUfe+T+ZNBB8cUwgkEcBQioTwEIRiAaZX8s5NbEFDd2gSz9QSunWFho+3d/jpqmU1SCIgcBa7Qt/MWFMsvTxd9LH33SNtcmTVH3IjBxJdnbGljQWdNhU9IsmKvpH8nD0OGSigHzfPJX528e+JF1tt/yqrmlxUNXU+TtDZ6IiBZQrzwYddsfg3N5vOjKOykIPRODTwHAIiCjExa2haLecW2bJ6v2VruYvnnik32t2TsWOm/nShxkNfA4nmJX/oo9jywgNlZxcTF+YGJZ0wQjiModEWvjorBbZJOO2NQ6/oV61SzNjC260VG7cDtjE9cSIIg5JBy0wtnKn9z6quT3+NrmFlcXHQ4fpkMAw+RhmlfgxTDFM/8TWPurqfUpib+FEvnTdEkHGlM7Bui4laiqOxMcy2Z2dqE6nXjTKmsws2s/NtDxF+EvUkjuGXWsEzlG2p6gi32Dxa7b/gjnDhh2mjGV0vbUUhHR0fJiPkGlF2atFs/d7IVbXnRnEZdQfdBIIFaynPB+CWtz5yc//Ez3zj3wyNjI3Qtn6vB9Ts085kqPnCfdbXajGU9Hhh9mrHWCowTUV4FDcq47mk9NbKBdtmKhsnYOdYHdHOmZdo6LAiGRNnZXGGvCUo3up9+018DYwCOXbQBm81mDaGWCh35EQq4M+Pmoc3SLVuCN2QZHSEvqio5G5lIcotuQT5w/tTsT80+MP85AJWJYxNXXas8VALTiqAIcVzTpPrZWCrjvhFPsjGHEBZ7wEZa09Xau3CIrlxg1o7s21CwUhACGB4MzTAvDE+WQSbJR+bJYZQ711z6yy8BY5zx6qxsilGY5heS+6Ju25sr5Ua8iGQlELoSgQGgXgXGGg6DkJHQpxbP1H9n8p6pP7n1hlvvzupC15yC9qFKgtAqz7008JpcR+8bbXHg22LbkZL0elECyJCAIVl5oX12IbeGtm14F5tFTO3YrlXzK9u6LlcmkCwXa9SAxEhT63Nnvu5mjr8EGJsDjlBbfoMwBsIRBIdGbvwRCfCupjTIqxeCcqvNVTjTGu2T0EhWZopQNryKVFVFmI0JOUSo4RdrM40Pn7t7+r3VanUehCZWOAuuefLH4KE7sqcxahB/6bhbmv5z13RzJmk8M7K2aoOoCA7UixWhgLmthbZFOcTw67TNtkGndW1z6ObTKYkoozJaJ09DDgqQUyYyARcKuSFbKi/ECx/6XCoshwNgMpW01FK5qYm5O3PFXF8xX9hpDHeoV68qnAomo9VUv3JtnLV+eKhXYbCEHHJkIiZP1fp8/fMLZ+pvOv3Ns3/5tiSpH0u7Ha7rpn8oBaaVHU6H+mCMNPm7zxtX+4jWl74aMO1g8C62eUY6HkmxvOOVaKXJujWxe1OJoU2ZpttqPRvqxFbVnUkEEGINovwLTb7vtiSJ70Zy4mz27pUQ6xCweGflU6S4m2GeHUVht7UGXsSRkhBAykqafm7asUpeBZ4CDihv8owGKlqVD8ycnf1PM5NLf7u7e/fdU7dP4dhxyPXSKg8Hk7RZ1Cbpn4VBKvX8bFDoeEaULz9H8r3wZCEq8N6njeSUEQFAt22SNtIwJBdHM0TpeN40Q7OSfjEkag2Tr83MJgszvyvzJ96DdCD7eiYi6r+5+wfz5dy7w2IIChReHZx6nxkiYrIcGgNSOG3qPfGC+3JtofZbUxML9yGdzvYwqLU9/I6LU9jFrttMfvh/BKXOfTYslpRtIVHjvTBBPVnSdbnGNhKYdFLHqhdmQxjahq9eJDA+G4nJWKm2E1TVszXG+Abc/Lk7tTbzHtGlv0KtNonDhwOMA8C4otUsV8QT+nZ2fUdnT/kWE9GLJNABpawDIaELvu5mxPvfm5w4+6l4Gg8ASDLR47bA4XGB2eDaGBhT4IgAnd2mZF5scx3PhO14gy30DsMWIMQQdVARBVTS5HBK8iJbFBhdHm1zcTfnClwiQ7bRSr6u9QxZRWGMMJGhuAK/eP5fmtP3fSeAyTUbYVXI27en82m53vzLiehVlJgHXQP/5+zEhXHE8QSAuE1HPaQDOB4pArOR1mFEPd9KVH5FWCh5LpWfYaLoqTBBERQg9q3h5/Ckfjnw4VUVSW15QiuJP7RKERdjb1aqo63R6rKq8gMVCGXMl5YRaEJJbeGepov/p9QWE8wvfQKYuXvZlo2Ax26HHDnSpi0KGEIN5zYTsMcF5kpC8ZWjJ9+7+7soKvw/Juwseg6fpCbqI5szogrvBZQ+UVFSy+mIexCUiRmikmJtaTVIm4CLWlB1OQyWTFBa8TmLV69MmWATiwnCIDAeJqlDKxc+VtTGW4ncqdOnT8+1CQGNjoKPfqj1gQ8vbfJIF5g10d0IARUCxtMGrFz37p4CLTQl/x9ypU4vJjwYa/gKtVEHMfeRCSHZdHsBQUi9KlgEECUiTvM6xNKuXbxIxoBFbNrtA0Falk2ZkU4Ph8AyUo3jY0+uOVsw7sNIamdjjn9nYWJiYZ2S0ca+2+MCc03vIZtRR7pr16786dOn68h1PycX5KFB7rW5cu834lr13Rzmz5ClvLDZSWwAMlClmMgaEBPTaidGRNtD9BpEAFVLpKH4NA/E8CeJ9FRcrzwxyoW/3azHJ6WxBNXaN9ziTIsNoYZH0WI/Go7WDs1QZXpRr67NDz3d1c/dbQr9zzFR9N2x9x/M57sXGMn3q/MvV+IcQENI2axZ2X4MoAsC5ZCpEUa2Kc6xF39KOfdPlfmpl4VheINF/LHq3OT/h6jjRjQX78Oj+Pj/AYEldRF4oy6MAAAAAElFTkSuQmCC";

const INITIAL_DATA = {
  households: [
    { id: "H001", address: "Cra 19 #14-22, B. Centro", owner: "María García", phone: "3201234567", zone: "Centro", score: 92, status: "Excelente", points: 450, penalties: 0, rewards: 3, lastAudit: "2026-06-10", irsu: "IRSU-001" },
    { id: "H002", address: "Cl 20 #8-45, B. Meridiano", owner: "Carlos Pérez", phone: "3109876543", zone: "Meridiano", score: 78, status: "Cumple", points: 280, penalties: 1, rewards: 1, lastAudit: "2026-06-12", irsu: "IRSU-002" },
    { id: "H003", address: "Cra 22 #18-10, B. El Bosque", owner: "Ana Rodríguez", phone: "3157654321", zone: "El Bosque", score: 65, status: "Reentrenamiento", points: 120, penalties: 2, rewards: 0, lastAudit: "2026-06-08", irsu: "IRSU-001" },
    { id: "H004", address: "Cl 15 #12-30, B. Unión", owner: "Jorge Martínez", phone: "3004567890", zone: "Unión", score: 95, status: "Excelente", points: 580, penalties: 0, rewards: 5, lastAudit: "2026-06-14", irsu: "IRSU-003" },
    { id: "H005", address: "Cra 25 #9-15, B. San Luis", owner: "Laura Sánchez", phone: "3183456789", zone: "San Luis", score: 52, status: "Incumplimiento", points: 40, penalties: 4, rewards: 0, lastAudit: "2026-06-05", irsu: "IRSU-002" },
  ],
  recyclers: [
    { id: "R001", name: "Pedro López", phone: "3201112233", zone: "Centro", households: 300, kgDay: 420, status: "Activo", formalized: true },
    { id: "R002", name: "Martha Díaz", phone: "3104445566", zone: "Meridiano", households: 280, kgDay: 380, status: "Activo", formalized: true },
    { id: "R003", name: "José Ramírez", phone: "3157778899", zone: "El Bosque", households: 310, kgDay: 440, status: "Activo", formalized: true },
  ],
  irsus: [
    { id: "IRSU-001", name: "Sandra Morales", zone: "Centro + El Bosque", households: 420, avgScore: 78.5 },
    { id: "IRSU-002", name: "Diego Castro", zone: "Meridiano + San Luis", households: 380, avgScore: 65.0 },
    { id: "IRSU-003", name: "Paola Ríos", zone: "Unión + Norte", households: 350, avgScore: 88.2 },
  ],
  dailyData: [
    { date: "2026-06-10", organic: 5.8, recyclable: 1.6, energy: 1.9, reject: 0.7, total: 10.0, purity: 87 },
    { date: "2026-06-11", organic: 6.1, recyclable: 1.5, energy: 1.8, reject: 0.6, total: 10.0, purity: 89 },
    { date: "2026-06-12", organic: 5.9, recyclable: 1.7, energy: 2.0, reject: 0.4, total: 10.0, purity: 91 },
    { date: "2026-06-13", organic: 6.0, recyclable: 1.4, energy: 1.9, reject: 0.7, total: 10.0, purity: 86 },
    { date: "2026-06-14", organic: 5.7, recyclable: 1.8, energy: 2.1, reject: 0.4, total: 10.0, purity: 92 },
    { date: "2026-06-15", organic: 6.2, recyclable: 1.5, energy: 1.7, reject: 0.6, total: 10.0, purity: 88 },
    { date: "2026-06-16", organic: 5.9, recyclable: 1.6, energy: 2.0, reject: 0.5, total: 10.0, purity: 90 },
  ],
  penalties: [
    { id: "P001", householdId: "H003", date: "2026-06-08", type: "Contaminación cruzada", description: "Orgánicos en bolsa blanca", severity: "Leve", resolved: false },
    { id: "P002", householdId: "H005", date: "2026-06-05", type: "No clasificación", description: "Todo mezclado en una sola bolsa", severity: "Grave", resolved: false },
  ],
  rewards: [
    { id: "RW001", householdId: "H001", date: "2026-06-10", type: "Descuento tarifa", description: "10% descuento servicio de aseo", points: 100 },
    { id: "RW002", householdId: "H004", date: "2026-06-14", type: "Bono comercial", description: "COP $20.000 en comercio local", points: 150 },
  ],
  logs: []
};

function getScoreColor(score) {
  if (score >= 90) return COLORS.emerald;
  if (score >= 75) return COLORS.blue;
  if (score >= 60) return COLORS.orange;
  return COLORS.red;
}

function getStatusLabel(score) {
  if (score >= 90) return "Excelente";
  if (score >= 75) return "Cumple";
  if (score >= 60) return "Reentrenamiento";
  return "Incumplimiento";
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background: COLORS.white, borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: `4px solid ${color}`, flex: "1 1 180px", minWidth: 170 }}>
      <div style={{ fontSize: 12, color: COLORS.gray, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{icon} {label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ width: "100%", height: 8, background: "#E0E0E0", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s" }} />
    </div>
  );
}

function Badge({ text, color }) {
  return <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 12, background: color + "22", color, fontSize: 12, fontWeight: 700 }}>{text}</span>;
}

function Tab({ active, label, onClick, count }) {
  return (
    <button onClick={onClick} style={{ padding: "10px 18px", border: "none", borderBottom: active ? `3px solid ${COLORS.blue}` : "3px solid transparent", background: "transparent", color: active ? COLORS.blue : COLORS.gray, fontWeight: active ? 700 : 500, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
      {label}
      {count !== undefined && <span style={{ background: active ? COLORS.blue : "#CCC", color: "#FFF", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{count}</span>}
    </button>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────

function AZNeuralGridOS() {
  const [data, setData] = useState(INITIAL_DATA);
  const [tab, setTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [detailHH, setDetailHH] = useState(null);
  const [filterZone, setFilterZone] = useState("Todas");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [publications, setPublications] = useState([]);
  const [pubForm, setPubForm] = useState({ type: "anuncio", title: "", body: "", media: "", fileData: "", fileName: "", fileKind: "" });
  const [uploading, setUploading] = useState(false);
  const [pubStatusMsg, setPubStatusMsg] = useState("");

  // Load data from persistent storage on mount
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("az-neural-grid-data");
        if (result && result.value) {
          setData(JSON.parse(result.value));
        }
      } catch (e) {
        // First time or no data yet
      }
      setLoading(false);
    })();
  }, []);

  const saveData = useCallback(async (newData) => {
    setData(newData);
    try {
      await window.storage.set("az-neural-grid-data", JSON.stringify(newData));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, []);

  const addLog = useCallback((action, detail) => {
    setData(prev => {
      const log = { id: `L${Date.now()}`, timestamp: new Date().toISOString(), action, detail };
      const newData = { ...prev, logs: [log, ...prev.logs].slice(0, 200) };
      try { window.storage.set("az-neural-grid-data", JSON.stringify(newData)); } catch (e) {}
      return newData;
    });
  }, []);

  // Load shared publications (ecosystem) — con auto-reparación si la clave está corrupta
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("az-ecosystem-publications", true);
        if (r && r.value) {
          const parsed = JSON.parse(r.value);
          if (Array.isArray(parsed)) setPublications(parsed);
          else { await window.storage.set("az-ecosystem-publications", "[]", true); setPublications([]); }
        }
      } catch (e) {
        // Clave corrupta: resetear automáticamente
        try { await window.storage.set("az-ecosystem-publications", "[]", true); } catch (e2) {}
        setPublications([]);
      }
    })();
  }, []);

  const savePublications = useCallback(async (pubs) => {
    setPublications(pubs); // UI primero
    try {
      await window.storage.set("az-ecosystem-publications", JSON.stringify(pubs), true);
      return true;
    } catch (e) {
      // Si falla, reintentar sin datos de archivo pesados
      try {
        const slim = pubs.map(p => (p.fileData && p.fileData.length > 300000) ? { ...p, fileData: "", fileKind: "" } : p);
        await window.storage.set("az-ecosystem-publications", JSON.stringify(slim), true);
        setPublications(slim);
        return true;
      } catch (e2) { return false; }
    }
  }, []);

  const clearAllPublications = useCallback(async () => {
    // Sin confirm() — acción directa porque confirm puede estar bloqueado en artifacts
    setPublications([]);
    setPubStatusMsg("Limpiando...");
    try {
      await window.storage.set("az-ecosystem-publications", "[]", true);
      setPubStatusMsg("✓ Todas las publicaciones fueron eliminadas");
    } catch (e) {
      try {
        await window.storage.delete("az-ecosystem-publications", true);
        setPubStatusMsg("✓ Publicaciones eliminadas");
      } catch (e2) {
        setPubStatusMsg("Recarga la app para completar la limpieza");
      }
    }
    setTimeout(() => setPubStatusMsg(""), 3000);
  }, []);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const MAX = 3 * 1024 * 1024; // 3MB límite estricto
    if (file.type.startsWith("video/")) {
      alert("Para videos, usa el campo 'Enlace de video YouTube' de arriba.\n\nLos archivos de video son demasiado pesados para guardarse dentro de la app y no se reproducen. Súbelo a YouTube (gratis) y pega el enlace; así se ve perfecto.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX) {
      alert(`El archivo pesa ${(file.size/1024/1024).toFixed(1)}MB. El máximo es 3MB.\n\nComprime la imagen o PDF, o usa un enlace.`);
      e.target.value = "";
      return;
    }
    let kind = "doc";
    if (file.type.startsWith("image/")) kind = "image";
    else if (file.type === "application/pdf") kind = "pdf";
    else if (file.type.startsWith("audio/")) kind = "audio";
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPubForm(pf => ({ ...pf, fileData: reader.result, fileName: file.name, fileKind: kind }));
      setUploading(false);
    };
    reader.onerror = () => { alert("Error al leer el archivo."); setUploading(false); };
    reader.readAsDataURL(file);
  }, []);

  const addPublication = useCallback(() => {
    if (!pubForm.title || !pubForm.body) { alert("Completa título y contenido."); return; }
    const pub = { id: `PUB${Date.now()}`, ...pubForm, date: new Date().toISOString(), author: "AZ CORPORATION" };
    const updated = [pub, ...publications].slice(0, 50);
    savePublications(updated);
    setPubForm({ type: "anuncio", title: "", body: "", media: "", fileData: "", fileName: "", fileKind: "" });
    addLog("Publicación", `${pubForm.type}: ${pubForm.title}`);
  }, [pubForm, publications, savePublications, addLog]);

  const deletePublication = useCallback(async (id) => {
    // Sin confirm() — borrado directo
    const updated = publications.filter(p => p.id !== id);
    setPublications(updated); // quitar de la UI de inmediato
    try {
      await window.storage.set("az-ecosystem-publications", JSON.stringify(updated), true);
    } catch (e) {
      // Si falla, reintentar limpiando datos de archivo
      try {
        const slim = updated.map(p => ({ ...p, fileData: "", fileKind: "" }));
        await window.storage.set("az-ecosystem-publications", JSON.stringify(slim), true);
        setPublications(slim);
      } catch (e2) {
        // Último recurso: limpiar todo
        try { await window.storage.set("az-ecosystem-publications", "[]", true); setPublications([]); } catch (e3) {}
      }
    }
  }, [publications]);

  // Save data to persistent storage on change
  const updateHouseholdScore = useCallback((id, newScore) => {
    const newData = {
      ...data,
      households: data.households.map(h => h.id === id ? { ...h, score: newScore, status: getStatusLabel(newScore), lastAudit: new Date().toISOString().split("T")[0] } : h)
    };
    saveData(newData);
    addLog("Puntuación", `${id} → ${newScore} puntos (${getStatusLabel(newScore)})`);
  }, [data, saveData, addLog]);

  const addPoints = useCallback((id, pts) => {
    const newData = {
      ...data,
      households: data.households.map(h => h.id === id ? { ...h, points: h.points + pts } : h)
    };
    saveData(newData);
    addLog("Puntos", `+${pts} puntos a ${id}`);
  }, [data, saveData, addLog]);

  const addPenalty = useCallback((householdId, type, description, severity) => {
    const penalty = { id: `P${Date.now()}`, householdId, date: new Date().toISOString().split("T")[0], type, description, severity, resolved: false };
    const hh = data.households.find(h => h.id === householdId);
    const scoreDelta = severity === "Grave" ? -15 : severity === "Moderada" ? -10 : -5;
    const newData = {
      ...data,
      penalties: [penalty, ...data.penalties],
      households: data.households.map(h => h.id === householdId ? { ...h, penalties: h.penalties + 1, score: Math.max(0, h.score + scoreDelta), status: getStatusLabel(Math.max(0, h.score + scoreDelta)) } : h)
    };
    saveData(newData);
    addLog("Penalización", `${type} (${severity}) a ${householdId} — ${hh?.owner || ""}`);
  }, [data, saveData, addLog]);

  const addReward = useCallback((householdId, type, description, pts) => {
    const reward = { id: `RW${Date.now()}`, householdId, date: new Date().toISOString().split("T")[0], type, description, points: pts };
    const newData = {
      ...data,
      rewards: [reward, ...data.rewards],
      households: data.households.map(h => h.id === householdId ? { ...h, rewards: h.rewards + 1, points: h.points + pts } : h)
    };
    saveData(newData);
    addLog("Reconocimiento", `${type} (+${pts} pts) a ${householdId}`);
  }, [data, saveData, addLog]);

  const addHousehold = useCallback((hh) => {
    const id = `H${String(data.households.length + 1).padStart(3, "0")}`;
    const newHH = { id, ...hh, score: 70, status: "Cumple", points: 0, penalties: 0, rewards: 0, lastAudit: new Date().toISOString().split("T")[0] };
    const newData = { ...data, households: [...data.households, newHH] };
    saveData(newData);
    addLog("Nuevo hogar", `${id} — ${hh.owner} — ${hh.address}`);
  }, [data, saveData, addLog]);

  const resetData = useCallback(async () => {
    if (confirm("¿Restaurar datos de demostración? Se perderán los cambios.")) {
      await saveData(INITIAL_DATA);
    }
  }, [saveData]);

  const generateHouseholdReport = useCallback((hh) => {
    const hhPenalties = data.penalties.filter(p => p.householdId === hh.id);
    const hhRewards = data.rewards.filter(r => r.householdId === hh.id);
    const irsu = data.irsus.find(i => i.id === hh.irsu);
    const win = window.open("", "_blank");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte ${hh.id} - ${hh.owner}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #37474F; padding: 40px; max-width: 800px; margin: 0 auto; }
      .header { border-bottom: 3px solid #1B3A5C; padding-bottom: 16px; margin-bottom: 24px; display:flex; justify-content:space-between; align-items:flex-end; }
      .brand { font-size: 24px; font-weight: 900; color: #1B3A5C; }
      .brand span { color: #3A5C2E; }
      .sub { font-size: 12px; color: #7A8A8A; letter-spacing: 2px; }
      h1 { color: #1B3A5C; font-size: 20px; margin: 24px 0 8px; }
      .scorebox { display:flex; gap:20px; margin: 16px 0; }
      .card { flex:1; background:#F5F5F5; border-radius:8px; padding:16px; text-align:center; }
      .card .v { font-size:32px; font-weight:900; }
      .card .l { font-size:11px; color:#888; text-transform:uppercase; }
      table { width:100%; border-collapse:collapse; margin:12px 0; }
      th { background:#1B3A5C; color:#fff; padding:8px; font-size:12px; text-align:left; }
      td { padding:8px; border-bottom:1px solid #eee; font-size:12px; }
      .foot { margin-top:40px; padding-top:16px; border-top:1px solid #ccc; font-size:10px; color:#aaa; text-align:center; }
      @media print { body { padding: 20px; } button { display:none; } }
    </style></head><body>
    <div class="header">
      <div><div class="brand">AZ <span>CORPORATION</span></div><div class="sub">NEURAL GRID OS · REPORTE DE HOGAR</div></div>
      <div style="text-align:right;font-size:11px;color:#888">Generado: ${new Date().toLocaleString("es-CO")}</div>
    </div>
    <h1>Información del Hogar</h1>
    <table>
      <tr><td><b>Código</b></td><td>${hh.id}</td><td><b>Propietario</b></td><td>${hh.owner}</td></tr>
      <tr><td><b>Dirección</b></td><td>${hh.address}</td><td><b>Zona</b></td><td>${hh.zone}</td></tr>
      <tr><td><b>Teléfono</b></td><td>${hh.phone || "N/A"}</td><td><b>IRSU asignado</b></td><td>${irsu ? irsu.name : hh.irsu}</td></tr>
      <tr><td><b>Última auditoría</b></td><td>${hh.lastAudit}</td><td><b>Estado</b></td><td>${hh.status}</td></tr>
    </table>
    <div class="scorebox">
      <div class="card"><div class="v" style="color:${hh.score>=90?"#3A5C2E":hh.score>=75?"#1B3A5C":hh.score>=60?"#E65100":"#B71C1C"}">${hh.score}</div><div class="l">Puntaje actual</div></div>
      <div class="card"><div class="v" style="color:#4A6B32">${hh.points}</div><div class="l">Puntos acumulados</div></div>
      <div class="card"><div class="v" style="color:#B71C1C">${hh.penalties}</div><div class="l">Penalizaciones</div></div>
      <div class="card"><div class="v" style="color:#3A5C2E">${hh.rewards}</div><div class="l">Reconocimientos</div></div>
    </div>
    <h1>Historial de Penalizaciones (${hhPenalties.length})</h1>
    ${hhPenalties.length ? `<table><tr><th>Fecha</th><th>Tipo</th><th>Severidad</th><th>Estado</th></tr>${hhPenalties.map(p=>`<tr><td>${p.date}</td><td>${p.type}</td><td>${p.severity}</td><td>${p.resolved?"Resuelta":"Activa"}</td></tr>`).join("")}</table>` : "<p style='color:#888;font-size:12px'>Sin penalizaciones registradas.</p>"}
    <h1>Historial de Reconocimientos (${hhRewards.length})</h1>
    ${hhRewards.length ? `<table><tr><th>Fecha</th><th>Tipo</th><th>Descripción</th><th>Puntos</th></tr>${hhRewards.map(r=>`<tr><td>${r.date}</td><td>${r.type}</td><td>${r.description}</td><td>+${r.points}</td></tr>`).join("")}</table>` : "<p style='color:#888;font-size:12px'>Sin reconocimientos registrados.</p>"}
    <div class="foot">AZ CORPORATION S.A.S. · Neural Grid OS · Documento confidencial · Generado automáticamente</div>
    <button onclick="window.print()" style="margin-top:24px;padding:10px 24px;background:#1B3A5C;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">🖨️ Imprimir / Guardar PDF</button>
    </body></html>`;
    win.document.write(html);
    win.document.close();
    addLog("Reporte PDF", `Reporte generado para ${hh.id} - ${hh.owner}`);
  }, [data, addLog]);

  const generateOperationsReport = useCallback(() => {
    const win = window.open("", "_blank");
    const totalHH2 = data.households.length;
    const avg = totalHH2 ? Math.round(data.households.reduce((s,h)=>s+h.score,0)/totalHH2) : 0;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte de Operaciones AZ</title>
    <style>
      body { font-family: Arial, sans-serif; color: #37474F; padding: 40px; max-width: 800px; margin: 0 auto; }
      .header { border-bottom: 3px solid #1B3A5C; padding-bottom: 16px; margin-bottom: 24px; }
      .brand { font-size: 24px; font-weight: 900; color: #1B3A5C; } .brand span { color: #3A5C2E; }
      .sub { font-size: 12px; color: #7A8A8A; letter-spacing: 2px; }
      h1 { color: #1B3A5C; font-size: 18px; margin: 20px 0 8px; }
      table { width:100%; border-collapse:collapse; margin:12px 0; }
      th { background:#1B3A5C; color:#fff; padding:8px; font-size:12px; text-align:left; }
      td { padding:8px; border-bottom:1px solid #eee; font-size:12px; }
      .foot { margin-top:40px; padding-top:16px; border-top:1px solid #ccc; font-size:10px; color:#aaa; text-align:center; }
      @media print { button { display:none; } }
    </style></head><body>
    <div class="header"><div class="brand">AZ <span>CORPORATION</span></div><div class="sub">NEURAL GRID OS · REPORTE DE OPERACIONES</div>
    <div style="font-size:11px;color:#888;margin-top:4px">Generado: ${new Date().toLocaleString("es-CO")}</div></div>
    <h1>Resumen General</h1>
    <table>
      <tr><td><b>Hogares registrados</b></td><td>${totalHH2}</td><td><b>Puntaje promedio</b></td><td>${avg}</td></tr>
      <tr><td><b>Recicladores</b></td><td>${data.recyclers.length}</td><td><b>Inspectores IRSU</b></td><td>${data.irsus.length}</td></tr>
      <tr><td><b>Penalizaciones totales</b></td><td>${data.penalties.length}</td><td><b>Reconocimientos</b></td><td>${data.rewards.length}</td></tr>
    </table>
    <h1>Procesamiento Diario (últimos registros)</h1>
    <table><tr><th>Fecha</th><th>Orgánicos</th><th>Reciclables</th><th>Energéticos</th><th>Rechazo</th><th>Total</th><th>Pureza</th></tr>
    ${data.dailyData.slice(-10).map(d=>`<tr><td>${d.date}</td><td>${d.organic}</td><td>${d.recyclable}</td><td>${d.energy}</td><td>${d.reject}</td><td><b>${d.total}</b></td><td>${d.purity}%</td></tr>`).join("")}</table>
    <h1>Hogares por Estado</h1>
    <table><tr><th>ID</th><th>Propietario</th><th>Zona</th><th>Puntaje</th><th>Estado</th><th>Puntos</th></tr>
    ${data.households.map(h=>`<tr><td>${h.id}</td><td>${h.owner}</td><td>${h.zone}</td><td>${h.score}</td><td>${h.status}</td><td>${h.points}</td></tr>`).join("")}</table>
    <div class="foot">AZ CORPORATION S.A.S. · Neural Grid OS · Documento confidencial</div>
    <button onclick="window.print()" style="margin-top:24px;padding:10px 24px;background:#1B3A5C;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">🖨️ Imprimir / Guardar PDF</button>
    </body></html>`;
    win.document.write(html); win.document.close();
    addLog("Reporte PDF", "Reporte general de operaciones generado");
  }, [data, addLog]);



  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui", color: COLORS.blue }}>Cargando AZ Neural Grid OS...</div>;

  // ── KPIs ──
  const totalHH = data.households.length;
  const avgScore = totalHH ? Math.round(data.households.reduce((s, h) => s + h.score, 0) / totalHH) : 0;
  const excellent = data.households.filter(h => h.score >= 90).length;
  const failing = data.households.filter(h => h.score < 60).length;
  const totalTons = data.dailyData.length ? data.dailyData[data.dailyData.length - 1].total : 0;
  const avgPurity = data.dailyData.length ? Math.round(data.dailyData.reduce((s, d) => s + d.purity, 0) / data.dailyData.length) : 0;
  const lastDay = data.dailyData.length ? data.dailyData[data.dailyData.length - 1] : null;
  const totalPoints = data.households.reduce((s, h) => s + h.points, 0);
  const activePenalties = data.penalties.filter(p => !p.resolved).length;

  const filtered = (list) => search ? list.filter(item => JSON.stringify(item).toLowerCase().includes(search.toLowerCase())) : list;

  // ── RENDER ──
  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.gray }}>
      {/* HEADER */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.blue})`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: COLORS.white, display: "flex", alignItems: "center", justifyContent: "center", padding: 3 }}><img src={AZ_LOGO} alt="AZ" style={{ height: "100%", objectFit: "contain" }} /></div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 18, letterSpacing: -0.5 }}>Neural Grid OS</div>
            <div style={{ color: "#90CAF9", fontSize: 11 }}>AZ CORPORATION · Gestión Integral RSU · Arauca</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #5C6BC0", background: "rgba(255,255,255,0.1)", color: COLORS.white, fontSize: 13, width: 180, outline: "none" }} />
          <button onClick={generateOperationsReport} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: COLORS.white, fontSize: 12, cursor: "pointer" }}>📄 Reporte</button>
          <button onClick={resetData} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "#A5C4E0", fontSize: 12, cursor: "pointer" }}>↺ Reset</button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: COLORS.white, borderBottom: "1px solid #E0E0E0", display: "flex", overflowX: "auto", paddingLeft: 16 }}>
        <Tab active={tab === "dashboard"} label="📊 Dashboard" onClick={() => setTab("dashboard")} />
        <Tab active={tab === "households"} label="🏠 Hogares" onClick={() => setTab("households")} count={totalHH} />
        <Tab active={tab === "recyclers"} label="♻️ Recicladores" onClick={() => setTab("recyclers")} count={data.recyclers.length} />
        <Tab active={tab === "penalties"} label="⚠️ Penalizaciones" onClick={() => setTab("penalties")} count={activePenalties} />
        <Tab active={tab === "rewards"} label="🏆 Reconocimientos" onClick={() => setTab("rewards")} count={data.rewards.length} />
        <Tab active={tab === "operations"} label="🚛 Operaciones" onClick={() => setTab("operations")} />
        <Tab active={tab === "publications"} label="📢 Publicaciones" onClick={() => setTab("publications")} count={publications.length} />
        <Tab active={tab === "guide"} label="🔬 Clasificación" onClick={() => setTab("guide")} />
        <Tab active={tab === "ccar"} label="📦 CCAR" onClick={() => setTab("ccar")} />
        <Tab active={tab === "logs"} label="📋 Bitácora" onClick={() => setTab("logs")} />
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1200, margin: "0 auto" }}>
        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
              <StatCard label="Hogares registrados" value={totalHH} color={COLORS.blue} icon="🏠" />
              <StatCard label="Puntaje promedio" value={avgScore} sub={`${excellent} excelentes · ${failing} incumpl.`} color={getScoreColor(avgScore)} icon="📊" />
              <StatCard label="Ton/día procesadas" value={totalTons.toFixed(1)} sub={`Pureza: ${avgPurity}%`} color={COLORS.emerald} icon="⚖️" />
              <StatCard label="Puntos activos" value={totalPoints.toLocaleString()} sub={`${data.rewards.length} reconocimientos`} color={COLORS.gold} icon="🏆" />
              <StatCard label="Penalizaciones activas" value={activePenalties} sub={`${data.penalties.length} total histórico`} color={activePenalties > 0 ? COLORS.red : COLORS.emerald} icon="⚠️" />
            </div>

            {lastDay && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>📦 Balance de Masas — Último Día ({lastDay.date})</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
                  {[
                    { label: "🟢 Orgánicos", value: lastDay.organic, color: COLORS.emerald, dest: "→ Biodigestores" },
                    { label: "⚪ Reciclables", value: lastDay.recyclable, color: COLORS.blue, dest: "→ Comercialización" },
                    { label: "⚫ Energéticos", value: lastDay.energy, color: COLORS.orange, dest: "→ Pirólisis" },
                    { label: "🔴 Rechazo real", value: lastDay.reject, color: COLORS.red, dest: "→ Gasificación / Disp." },
                  ].map(item => (
                    <div key={item.label} style={{ background: COLORS.white, borderRadius: 10, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.gray }}>{item.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: item.color, margin: "6px 0" }}>{item.value} ton</div>
                      <MiniBar value={item.value} max={totalTons} color={item.color} />
                      <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>{item.dest}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>📈 Tendencia Semanal — Pureza de Material (%)</h3>
            <div style={{ background: COLORS.white, borderRadius: 10, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
                {data.dailyData.map((d, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: d.purity >= 90 ? COLORS.emerald : COLORS.blue, marginBottom: 4 }}>{d.purity}%</div>
                    <div style={{ width: "100%", maxWidth: 40, height: `${d.purity}%`, background: `linear-gradient(180deg, ${d.purity >= 90 ? COLORS.emerald : COLORS.blue}, ${d.purity >= 90 ? COLORS.lime : COLORS.lightBlue})`, borderRadius: "6px 6px 0 0", transition: "height 0.5s" }} />
                    <div style={{ fontSize: 10, color: "#999", marginTop: 4 }}>{d.date.slice(5)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HOGARES ── */}
        {tab === "households" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy }}>🏠 Gestión de Hogares</h3>
              <button onClick={() => { setFormData({ owner: "", address: "", phone: "", zone: "", irsu: "IRSU-001" }); setModal("addHH"); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: COLORS.blue, color: COLORS.white, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Nuevo Hogar</button>
            </div>
            {/* FILTROS */}
            <div style={{ display: "flex", gap: 12, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray }}>Zona:</span>
                <select value={filterZone} onChange={e => setFilterZone(e.target.value)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 13, cursor: "pointer" }}>
                  <option value="Todas">Todas</option>
                  {[...new Set(data.households.map(h => h.zone))].map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray }}>Estado:</span>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 13, cursor: "pointer" }}>
                  <option value="Todos">Todos</option>
                  <option value="Excelente">Excelente (90-100)</option>
                  <option value="Cumple">Cumple (75-89)</option>
                  <option value="Reentrenamiento">Reentrenamiento (60-74)</option>
                  <option value="Incumplimiento">Incumplimiento (&lt;60)</option>
                </select>
              </div>
              {(filterZone !== "Todas" || filterStatus !== "Todos" || search) && (
                <button onClick={() => { setFilterZone("Todas"); setFilterStatus("Todos"); setSearch(""); }} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${COLORS.red}`, background: "transparent", color: COLORS.red, fontSize: 12, cursor: "pointer" }}>✕ Limpiar filtros</button>
              )}
              <span style={{ marginLeft: "auto", fontSize: 13, color: COLORS.gray, fontWeight: 600 }}>
                {(() => { const n = data.households.filter(h => (filterZone === "Todas" || h.zone === filterZone) && (filterStatus === "Todos" || h.status === filterStatus) && (!search || JSON.stringify(h).toLowerCase().includes(search.toLowerCase()))).length; return `${n} de ${data.households.length} hogares`; })()}
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: COLORS.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <thead>
                  <tr style={{ background: COLORS.navy }}>
                    {["ID", "Propietario", "Dirección", "Zona", "Puntaje", "Estado", "Puntos", "Acciones"].map(h => (
                      <th key={h} style={{ padding: "10px 12px", color: COLORS.white, fontSize: 12, fontWeight: 700, textAlign: "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.households.filter(h => (filterZone === "Todas" || h.zone === filterZone) && (filterStatus === "Todos" || h.status === filterStatus) && (!search || JSON.stringify(h).toLowerCase().includes(search.toLowerCase()))).map((h, i) => (
                    <tr key={h.id} style={{ background: i % 2 === 1 ? "#F8F9FA" : COLORS.white, borderBottom: "1px solid #EEE" }}>
                      <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700 }}>{h.id}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{h.owner}</td>
                      <td style={{ padding: "10px 12px", fontSize: 12, color: "#666" }}>{h.address}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{h.zone}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 800, color: getScoreColor(h.score), fontSize: 16 }}>{h.score}</span>
                          <MiniBar value={h.score} max={100} color={getScoreColor(h.score)} />
                        </div>
                      </td>
                      <td style={{ padding: "10px 12px" }}><Badge text={h.status} color={getScoreColor(h.score)} /></td>
                      <td style={{ padding: "10px 12px", fontWeight: 700, color: COLORS.gold }}>{h.points}</td>
                      <td style={{ padding: "10px 12px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button onClick={() => { const s = prompt(`Nuevo puntaje para ${h.owner} (0-100):`, h.score); if (s !== null) updateHouseholdScore(h.id, Math.min(100, Math.max(0, parseInt(s)))); }} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.blue}`, background: "transparent", color: COLORS.blue, fontSize: 11, cursor: "pointer" }}>📝 Score</button>
                          <button onClick={() => addPoints(h.id, 25)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.gold}`, background: "transparent", color: COLORS.gold, fontSize: 11, cursor: "pointer" }}>+25pts</button>
                          <button onClick={() => addPenalty(h.id, "Contaminación", "Infracción registrada por IRSU", "Leve")} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.red}`, background: "transparent", color: COLORS.red, fontSize: 11, cursor: "pointer" }}>⚠️</button>
                          <button onClick={() => setDetailHH(h)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.teal}`, background: "transparent", color: COLORS.teal, fontSize: 11, cursor: "pointer" }}>👁️ Ver</button>
                          <button onClick={() => generateHouseholdReport(h)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${COLORS.navy}`, background: "transparent", color: COLORS.navy, fontSize: 11, cursor: "pointer" }}>📄 PDF</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RECICLADORES ── */}
        {tab === "recyclers" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>♻️ Recicladores Formalizados</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              {data.recyclers.map(r => (
                <div key={r.id} style={{ background: COLORS.white, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: `4px solid ${COLORS.emerald}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{r.id} · {r.phone}</div>
                    </div>
                    <Badge text={r.formalized ? "Formalizado" : "Informal"} color={r.formalized ? COLORS.emerald : COLORS.orange} />
                  </div>
                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888" }}>Zona</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.zone}</div>
                    </div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888" }}>Viviendas</div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.households}</div>
                    </div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888" }}>Carga/día</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.emerald }}>{r.kgDay} kg</div>
                    </div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: 10, textAlign: "center" }}>
                      <div style={{ fontSize: 11, color: "#888" }}>Estado</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: r.status === "Activo" ? COLORS.emerald : COLORS.red }}>{r.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginTop: 24, marginBottom: 12 }}>🔍 Inspectores IRSU</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", background: COLORS.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <thead><tr style={{ background: COLORS.teal }}>{["ID", "Inspector", "Zona", "Hogares", "Puntaje Prom."].map(h => <th key={h} style={{ padding: "10px 12px", color: COLORS.white, fontSize: 12, fontWeight: 700, textAlign: "left" }}>{h}</th>)}</tr></thead>
              <tbody>{data.irsus.map((ir, i) => (
                <tr key={ir.id} style={{ background: i % 2 === 1 ? "#F8F9FA" : COLORS.white }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700, fontSize: 13 }}>{ir.id}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>{ir.name}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>{ir.zone}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>{ir.households}</td>
                  <td style={{ padding: "10px 12px" }}><span style={{ fontWeight: 800, color: getScoreColor(ir.avgScore) }}>{ir.avgScore}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* ── PENALIZACIONES ── */}
        {tab === "penalties" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>⚠️ Registro de Penalizaciones</h3>
            {data.penalties.length === 0 ? <p style={{ color: "#999" }}>No hay penalizaciones registradas.</p> :
              <table style={{ width: "100%", borderCollapse: "collapse", background: COLORS.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <thead><tr style={{ background: COLORS.red }}>{["ID", "Hogar", "Fecha", "Tipo", "Severidad", "Estado", "Acción"].map(h => <th key={h} style={{ padding: "10px 12px", color: COLORS.white, fontSize: 12, fontWeight: 700, textAlign: "left" }}>{h}</th>)}</tr></thead>
                <tbody>{filtered(data.penalties).map((p, i) => {
                  const hh = data.households.find(h => h.id === p.householdId);
                  return (
                    <tr key={p.id} style={{ background: i % 2 === 1 ? "#FFF3F3" : COLORS.white }}>
                      <td style={{ padding: "10px 12px", fontWeight: 700, fontSize: 13 }}>{p.id}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{hh?.owner || p.householdId}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{p.date}</td>
                      <td style={{ padding: "10px 12px", fontSize: 13 }}>{p.type}</td>
                      <td style={{ padding: "10px 12px" }}><Badge text={p.severity} color={p.severity === "Grave" ? COLORS.red : p.severity === "Moderada" ? COLORS.orange : COLORS.gold} /></td>
                      <td style={{ padding: "10px 12px" }}><Badge text={p.resolved ? "Resuelta" : "Activa"} color={p.resolved ? COLORS.emerald : COLORS.red} /></td>
                      <td style={{ padding: "10px 12px" }}>{!p.resolved && <button onClick={() => { const newData = { ...data, penalties: data.penalties.map(x => x.id === p.id ? { ...x, resolved: true } : x) }; saveData(newData); }} style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: COLORS.emerald, color: COLORS.white, fontSize: 11, cursor: "pointer" }}>✓ Resolver</button>}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            }
          </div>
        )}

        {/* ── RECONOCIMIENTOS ── */}
        {tab === "rewards" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy }}>🏆 Reconocimientos y Puntos</h3>
              <button onClick={() => { const hid = prompt("ID del hogar (ej: H001):"); if (hid) addReward(hid, "Bono comunidad", "Reconocimiento por excelencia en clasificación", 50); }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: COLORS.gold, color: COLORS.navy, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>+ Nuevo Reconocimiento</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
              {data.rewards.map(r => {
                const hh = data.households.find(h => h.id === r.householdId);
                return (
                  <div key={r.id} style={{ background: COLORS.white, borderRadius: 10, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${COLORS.gold}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: 700, color: COLORS.navy }}>{hh?.owner || r.householdId}</div>
                      <div style={{ fontWeight: 800, color: COLORS.gold }}>+{r.points} pts</div>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{r.date} · {r.type}</div>
                    <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 6 }}>{r.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── OPERACIONES ── */}
        {tab === "operations" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>🚛 Control de Operaciones</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 24 }}>
              {[
                { route: "Ruta Verde", icon: "🟢", type: "Orgánicos", dest: "Biodigestores", tons: lastDay?.organic || 0, color: COLORS.emerald },
                { route: "Ruta Blanca", icon: "⚪", type: "Reciclables", dest: "Comercialización", tons: lastDay?.recyclable || 0, color: COLORS.blue },
                { route: "Ruta Negra Energética", icon: "⚫", type: "Fracción AZ", dest: "Pirólisis → Refinación", tons: lastDay?.energy || 0, color: COLORS.orange },
                { route: "Ruta Rechazo", icon: "🔴", type: "Rechazo real", dest: "Gasificación / Disposición", tons: lastDay?.reject || 0, color: COLORS.red },
              ].map(r => (
                <div key={r.route} style={{ background: COLORS.white, borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: `4px solid ${r.color}` }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{r.icon}</div>
                  <div style={{ fontWeight: 800, color: COLORS.navy, fontSize: 15 }}>{r.route}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{r.type} → {r.dest}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: r.color, marginTop: 8 }}>{r.tons} ton</div>
                  <MiniBar value={r.tons} max={totalTons} color={r.color} />
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>📊 Historial de Procesamiento (7 días)</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", background: COLORS.white, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <thead><tr style={{ background: COLORS.navy }}>{["Fecha", "Orgánicos", "Reciclables", "Energéticos", "Rechazo", "Total", "Pureza"].map(h => <th key={h} style={{ padding: "10px 12px", color: COLORS.white, fontSize: 12, fontWeight: 700, textAlign: "center" }}>{h}</th>)}</tr></thead>
              <tbody>{data.dailyData.map((d, i) => (
                <tr key={d.date} style={{ background: i % 2 === 1 ? "#F8F9FA" : COLORS.white, textAlign: "center" }}>
                  <td style={{ padding: "8px 12px", fontSize: 13 }}>{d.date}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: COLORS.emerald, fontWeight: 700 }}>{d.organic}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: COLORS.blue, fontWeight: 700 }}>{d.recyclable}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: COLORS.orange, fontWeight: 700 }}>{d.energy}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: COLORS.red, fontWeight: 700 }}>{d.reject}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, fontWeight: 800 }}>{d.total}</td>
                  <td style={{ padding: "8px 12px" }}><Badge text={`${d.purity}%`} color={d.purity >= 90 ? COLORS.emerald : COLORS.blue} /></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* ── PUBLICACIONES (ECOSISTEMA) ── */}
        {tab === "publications" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy }}>📢 Centro de Publicaciones</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {pubStatusMsg && <span style={{ fontSize: 12, color: COLORS.green, fontWeight: 600 }}>{pubStatusMsg}</span>}
                {publications.length > 0 && (
                  <button onClick={clearAllPublications} style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${COLORS.red}`, background: COLORS.red, color: COLORS.white, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>🧹 Borrar todo ({publications.length})</button>
                )}
              </div>
            </div>
            <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 20 }}>Lo que publiques aquí se verá automáticamente en la app ciudadana <b>AZ Mi Barrio</b> de todos los hogares.</p>

            {/* Create form */}
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 24, borderLeft: `4px solid ${COLORS.green}` }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.navy, marginBottom: 14 }}>✏️ Nueva Publicación</div>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 160px" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Tipo de publicación</label>
                    <select value={pubForm.type} onChange={e => setPubForm({ ...pubForm, type: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4 }}>
                      <option value="anuncio">📣 Anuncio</option>
                      <option value="video">🎬 Video</option>
                      <option value="campaña">📢 Campaña publicitaria</option>
                      <option value="educativo">📚 Contenido educativo</option>
                      <option value="evento">📅 Evento</option>
                    </select>
                  </div>
                  <div style={{ flex: "2 1 280px" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Título</label>
                    <input value={pubForm.title} onChange={e => setPubForm({ ...pubForm, title: e.target.value })} placeholder="Ej: Nueva jornada de reciclaje" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4, boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Contenido / Mensaje</label>
                  <textarea value={pubForm.body} onChange={e => setPubForm({ ...pubForm, body: e.target.value })} placeholder="Escribe el mensaje que verán los ciudadanos..." rows={3} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4, boxSizing: "border-box", resize: "vertical", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Enlace de video YouTube (opcional)</label>
                  <input value={pubForm.media} onChange={e => setPubForm({ ...pubForm, media: e.target.value })} placeholder="https://youtube.com/watch?v=..." style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray }}>Subir archivo: imagen, PDF, audio MP3 o video MP4 (máx 4MB)</label>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
                    <label style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${COLORS.teal}`, background: COLORS.white, color: COLORS.teal, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      📎 Seleccionar archivo
                      <input type="file" accept="image/*,application/pdf,audio/mpeg,audio/mp3" onChange={handleFileUpload} style={{ display: "none" }} />
                    </label>
                    {uploading && <span style={{ fontSize: 12, color: COLORS.blue }}>Cargando...</span>}
                    {pubForm.fileName && !uploading && (
                      <span style={{ fontSize: 12, color: COLORS.green, display: "flex", alignItems: "center", gap: 6 }}>
                        {pubForm.fileKind === "image" ? "🖼️" : pubForm.fileKind === "audio" ? "🎵" : pubForm.fileKind === "video" ? "🎬" : "📄"} {pubForm.fileName}
                        <button onClick={() => setPubForm({ ...pubForm, fileData: "", fileName: "", fileKind: "" })} style={{ border: "none", background: "transparent", color: COLORS.red, cursor: "pointer", fontSize: 14 }}>×</button>
                      </span>
                    )}
                  </div>
                  {pubForm.fileKind === "image" && pubForm.fileData && (
                    <img src={pubForm.fileData} alt="preview" style={{ maxHeight: 120, borderRadius: 8, marginTop: 8, border: "1px solid #eee" }} />
                  )}
                  {pubForm.fileKind === "audio" && pubForm.fileData && (
                    <audio controls src={pubForm.fileData} style={{ width: "100%", marginTop: 8 }} />
                  )}
                  {pubForm.fileKind === "video" && pubForm.fileData && (
                    <video controls src={pubForm.fileData} style={{ maxHeight: 160, borderRadius: 8, marginTop: 8, width: "100%" }} />
                  )}
                  {pubForm.fileKind === "audio" && pubForm.fileData && (
                    <audio controls src={pubForm.fileData} style={{ width: "100%", marginTop: 8 }} />
                  )}
                  {pubForm.fileKind === "video" && pubForm.fileData && (
                    <video controls src={pubForm.fileData} style={{ width: "100%", maxHeight: 200, borderRadius: 8, marginTop: 8 }} />
                  )}
                </div>
                <button onClick={addPublication} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: COLORS.green, color: COLORS.white, fontWeight: 700, cursor: "pointer", fontSize: 14, justifySelf: "start" }}>📢 Publicar a todos los ciudadanos</button>
              </div>
            </div>

            {/* Published list */}
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.navy, marginBottom: 12 }}>Publicaciones activas ({publications.length})</div>
            {publications.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", padding: 30 }}>Aún no hay publicaciones. Crea la primera arriba.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {publications.map(pub => {
                  const typeIcons = { anuncio: "📣", video: "🎬", "campaña": "📢", educativo: "📚", evento: "📅" };
                  const typeColors = { anuncio: COLORS.blue, video: COLORS.red, "campaña": COLORS.green, educativo: COLORS.teal, evento: COLORS.gold };
                  return (
                    <div key={pub.id} style={{ background: COLORS.white, borderRadius: 10, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `4px solid ${typeColors[pub.type] || COLORS.blue}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 18 }}>{typeIcons[pub.type] || "📣"}</span>
                            <span style={{ fontWeight: 800, color: COLORS.navy, fontSize: 15 }}>{pub.title}</span>
                            <Badge text={pub.type} color={typeColors[pub.type] || COLORS.blue} />
                          </div>
                          <div style={{ fontSize: 13, color: COLORS.gray, marginBottom: 6 }}>{pub.body}</div>
                          {pub.media && <a href={pub.media} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: COLORS.blue, wordBreak: "break-all", display: "block" }}>🔗 {pub.media}</a>}
                          {pub.fileKind === "image" && pub.fileData && <img src={pub.fileData} alt={pub.fileName} style={{ maxHeight: 100, borderRadius: 8, marginTop: 6 }} />}
                          {pub.fileKind === "pdf" && pub.fileData && <a href={pub.fileData} download={pub.fileName} style={{ fontSize: 12, color: COLORS.red, display: "block", marginTop: 6 }}>📄 {pub.fileName}</a>}
                          {pub.fileKind === "audio" && pub.fileData && <audio controls src={pub.fileData} style={{ width: "100%", marginTop: 6 }} />}
                          {pub.fileKind === "video" && pub.fileData && <video controls src={pub.fileData} style={{ maxHeight: 140, width: "100%", borderRadius: 8, marginTop: 6 }} />}
                          {pub.fileKind === "audio" && pub.fileData && <audio controls src={pub.fileData} style={{ width: "100%", marginTop: 6 }} />}
                          {pub.fileKind === "video" && pub.fileData && <video controls src={pub.fileData} style={{ width: "100%", maxHeight: 180, borderRadius: 8, marginTop: 6 }} />}
                          <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>{new Date(pub.date).toLocaleString("es-CO")} · {pub.author}</div>
                          {/* Resumen de interacción ciudadana */}
                          {(pub.reactions && Object.values(pub.reactions).some(v => v > 0)) || (pub.comments && pub.comments.length > 0) ? (
                            <div style={{ marginTop: 8, padding: "8px 10px", background: "#F5F7F5", borderRadius: 8 }}>
                              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                                {pub.reactions && Object.entries(pub.reactions).filter(([,v]) => v > 0).map(([em, v]) => (
                                  <span key={em} style={{ fontSize: 13 }}>{em} {v}</span>
                                ))}
                                {pub.comments && pub.comments.length > 0 && <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600 }}>💬 {pub.comments.length} comentario(s)</span>}
                              </div>
                              {pub.comments && pub.comments.slice(-3).map(cm => (
                                <div key={cm.id} style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}><b>{cm.user}:</b> {cm.text}</div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <button onClick={() => deletePublication(pub.id)} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${COLORS.red}`, background: "transparent", color: COLORS.red, fontSize: 11, cursor: "pointer" }}>🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── GUÍA DE CLASIFICACIÓN ── */}
        {tab === "guide" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>🔬 Guía de Clasificación de Residuos — Árbol de Decisión</h3>
            <p style={{ fontSize: 14, color: COLORS.gray, marginBottom: 20 }}>Herramienta para operadores del CCAR. Siga el flujo para determinar la línea de destino correcta de cada material.</p>
            
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, marginBottom: 16 }}>Paso 1: ¿El material es biodegradable? (¿Se pudre en 2 semanas?)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#E8F5E9", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.emerald}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.emerald, fontSize: 14 }}>✅ SÍ → BIODIGESTOR (Línea 1)</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Restos comida, frutas, verduras, cáscaras, residuos matadero, poda, lodos PTAR, estiércol</div>
                  <div style={{ marginTop: 8, padding: 8, background: COLORS.emerald, borderRadius: 6, color: COLORS.white, textAlign: "center", fontWeight: 700, fontSize: 12 }}>→ Biogás → Electricidad + Biofertilizante</div>
                </div>
                <div style={{ background: "#FFF3E0", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.orange}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.orange, fontSize: 14 }}>❌ NO → Ir al Paso 2</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Continuar evaluación del material...</div>
                </div>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, marginBottom: 16 }}>Paso 2: ¿Es plástico identificable (PE, PP, PS, caucho)?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#FFF8E1", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.gold}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.gold, fontSize: 14 }}>✅ SÍ → PIRÓLISIS (Línea 2)</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>PEAD, PEBD, PP, PS, icopor, cauchos, suelas, plásticos de alto poder calorífico</div>
                  <div style={{ marginTop: 8, padding: 8, background: COLORS.gold, borderRadius: 6, color: COLORS.navy, textAlign: "center", fontWeight: 700, fontSize: 12 }}>→ Piro Oil → Refinación → Diésel + Nafta + Queroseno</div>
                </div>
                <div style={{ background: "#FFF3E0", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.orange}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.orange, fontSize: 14 }}>❌ NO → Ir al Paso 3</div>
                </div>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, marginBottom: 16 }}>Paso 3: ¿Es reciclable limpio (papel, cartón, vidrio, metal)?</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#E3F2FD", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.blue}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.blue, fontSize: 14 }}>✅ SÍ → RECICLAJE (Línea 4)</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Papel, cartón, vidrio, metales, Tetra Pak limpios</div>
                  <div style={{ marginTop: 8, padding: 8, background: COLORS.blue, borderRadius: 6, color: COLORS.white, textAlign: "center", fontWeight: 700, fontSize: 12 }}>→ Comercialización directa a industria</div>
                </div>
                <div style={{ background: "#FFF3E0", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.orange}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.orange, fontSize: 14 }}>❌ NO → Ir al Paso 4</div>
                </div>
              </div>
            </div>

            <div style={{ background: COLORS.white, borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy, marginBottom: 16 }}>Paso 4: ¿Arde? (¿Tiene poder calorífico {">"} 15 MJ/kg?)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "#E0F2F1", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.teal}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.teal, fontSize: 14 }}>✅ SÍ → GASIFICACIÓN / SYNGAS (Línea 3)</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Textiles naturales, maderas, cuero, corcho, fibras secas, pañales, mezclas combustibles</div>
                  <div style={{ marginTop: 8, padding: 8, background: COLORS.teal, borderRadius: 6, color: COLORS.white, textAlign: "center", fontWeight: 700, fontSize: 12 }}>→ Syngas → Electricidad / Calor</div>
                </div>
                <div style={{ background: "#FFEBEE", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.red}` }}>
                  <div style={{ fontWeight: 800, color: COLORS.red, fontSize: 14 }}>❌ NO → DISPOSICIÓN FINAL</div>
                  <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 8 }}>Material inerte sin valor energético ni reciclable. Meta: {"<"} 5% del total.</div>
                </div>
              </div>
            </div>

            <div style={{ background: "#FFEBEE", borderRadius: 10, padding: 16, border: `2px solid ${COLORS.red}` }}>
              <div style={{ fontWeight: 800, color: COLORS.red, fontSize: 14, marginBottom: 8 }}>⛔ NUNCA ingresan al sistema AZ:</div>
              <div style={{ fontSize: 13, color: COLORS.gray }}>Baterías · RAEE (electrónicos) · Residuos peligrosos (químicos, hospitalarios sin tratar) · Bombillos fluorescentes · Envases de pesticidas · Material radiactivo</div>
            </div>
          </div>
        )}

        {/* ── CCAR OPERATIONS ── */}
        {tab === "ccar" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>📦 Centros Comunitarios de Acopio (CCAR)</h3>
            
            {/* Daily data entry form */}
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 20, borderLeft: `4px solid ${COLORS.emerald}` }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: COLORS.navy, marginBottom: 12 }}>📝 Registrar Datos del Día</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                {[
                  { key: "organic", label: "🟢 Orgánicos (ton)", color: COLORS.emerald },
                  { key: "recyclable", label: "⚪ Reciclables (ton)", color: COLORS.blue },
                  { key: "energy", label: "⚫ Energéticos (ton)", color: COLORS.orange },
                  { key: "reject", label: "🔴 Rechazo (ton)", color: COLORS.red },
                  { key: "purity", label: "Pureza (%)", color: COLORS.teal },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: field.color }}>{field.label}</label>
                    <input type="number" step="0.1" id={`daily-${field.key}`} placeholder="0.0" style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: `1px solid #CCC`, fontSize: 14, marginTop: 4, boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
              <button onClick={() => {
                const vals = {};
                let valid = true;
                ["organic","recyclable","energy","reject","purity"].forEach(k => {
                  const el = document.getElementById(`daily-${k}`);
                  const v = parseFloat(el?.value);
                  if (isNaN(v)) valid = false;
                  vals[k] = v || 0;
                });
                if (!valid) { alert("Complete todos los campos con valores numéricos."); return; }
                const entry = { date: new Date().toISOString().split("T")[0], organic: vals.organic, recyclable: vals.recyclable, energy: vals.energy, reject: vals.reject, total: +(vals.organic + vals.recyclable + vals.energy + vals.reject).toFixed(1), purity: vals.purity };
                const newData = { ...data, dailyData: [...data.dailyData.slice(-29), entry] };
                saveData(newData);
                addLog("Datos diarios", `Total: ${entry.total} ton | Pureza: ${entry.purity}%`);
                ["organic","recyclable","energy","reject","purity"].forEach(k => { const el = document.getElementById(`daily-${k}`); if(el) el.value = ""; });
              }} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, border: "none", background: COLORS.emerald, color: COLORS.white, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                ✓ Registrar Día
              </button>
            </div>

            {/* CCAR Status cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
              {[
                { name: "CCAR Norte", zone: "Centro + El Bosque", capacity: "3.5 ton/día", fill: 78, status: "Operativo" },
                { name: "CCAR Sur", zone: "Meridiano + San Luis", capacity: "3.5 ton/día", fill: 65, status: "Operativo" },
                { name: "CCAR Oeste", zone: "Unión + Norte", capacity: "3.0 ton/día", fill: 52, status: "Operativo" },
              ].map(ccar => (
                <div key={ccar.name} style={{ background: COLORS.white, borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: `4px solid ${ccar.fill > 85 ? COLORS.red : COLORS.emerald}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.navy }}>{ccar.name}</div>
                    <Badge text={ccar.status} color={COLORS.emerald} />
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{ccar.zone} · Cap: {ccar.capacity}</div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: COLORS.gray }}>Buffer utilizado</span>
                      <span style={{ fontWeight: 700, color: ccar.fill > 85 ? COLORS.red : COLORS.emerald }}>{ccar.fill}%</span>
                    </div>
                    <MiniBar value={ccar.fill} max={100} color={ccar.fill > 85 ? COLORS.red : COLORS.emerald} />
                  </div>
                  <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6 }}>
                    {[
                      { label: "🟢", val: (lastDay?.organic * ccar.fill / 200 || 0).toFixed(1) },
                      { label: "⚪", val: (lastDay?.recyclable * ccar.fill / 200 || 0).toFixed(1) },
                      { label: "⚫", val: (lastDay?.energy * ccar.fill / 200 || 0).toFixed(1) },
                      { label: "🔴", val: (lastDay?.reject * ccar.fill / 200 || 0).toFixed(1) },
                    ].map(f => (
                      <div key={f.label} style={{ textAlign: "center", background: "#F5F5F5", borderRadius: 6, padding: 6 }}>
                        <div style={{ fontSize: 16 }}>{f.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{f.val}t</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reclassification stats */}
            <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy, marginBottom: 12 }}>🔬 Reclasificación Secundaria — Bolsa Negra</h3>
            <div style={{ background: COLORS.white, borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { label: "Fracción Energética AZ", pct: "78%", dest: "→ Pirólisis", color: COLORS.gold, icon: "⚡" },
                  { label: "Textiles + Maderas", pct: "14%", dest: "→ Gasificación", color: COLORS.teal, icon: "🪵" },
                  { label: "Rechazo Real", pct: "8%", dest: "→ Disposición", color: COLORS.red, icon: "🗑️" },
                ].map(f => (
                  <div key={f.label} style={{ textAlign: "center", padding: 16, background: f.color + "11", borderRadius: 10 }}>
                    <div style={{ fontSize: 24 }}>{f.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.navy, marginTop: 6 }}>{f.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: f.color, margin: "4px 0" }}>{f.pct}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{f.dest}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {tab === "logs" && (
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>📋 Bitácora de Actividades</h3>
            {data.logs.length === 0 ? <p style={{ color: "#999", textAlign: "center", padding: 40 }}>Sin registros. Las acciones se registrarán automáticamente.</p> :
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.logs.slice(0, 50).map(log => (
                  <div key={log.id} style={{ background: COLORS.white, borderRadius: 8, padding: "10px 16px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)", display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ fontSize: 11, color: "#999", minWidth: 130 }}>{new Date(log.timestamp).toLocaleString("es-CO")}</div>
                    <Badge text={log.action} color={log.action === "Penalización" ? COLORS.red : log.action === "Reconocimiento" ? COLORS.gold : COLORS.blue} />
                    <div style={{ fontSize: 13, color: COLORS.gray }}>{log.detail}</div>
                  </div>
                ))}
              </div>
            }
          </div>
        )}
      </div>

      {/* ── DETALLE DE VIVIENDA ── */}
      {detailHH && (() => {
        const hh = data.households.find(x => x.id === detailHH.id) || detailHH;
        const hhPen = data.penalties.filter(p => p.householdId === hh.id);
        const hhRew = data.rewards.filter(r => r.householdId === hh.id);
        const irsu = data.irsus.find(i => i.id === hh.irsu);
        const recycler = data.recyclers.find(r => r.zone === hh.zone);
        const activePen = hhPen.filter(p => !p.resolved).length;
        const totalRewPts = hhRew.reduce((s, r) => s + r.points, 0);
        const scoreCol = getScoreColor(hh.score);
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", justifyContent: "center", alignItems: "flex-start", zIndex: 1000, overflowY: "auto", padding: "40px 20px" }} onClick={() => setDetailHH(null)}>
            <div style={{ background: COLORS.white, borderRadius: 16, width: "100%", maxWidth: 720, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.green})`, borderRadius: "16px 16px 0 0", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: COLORS.white, fontSize: 20, fontWeight: 800 }}>{hh.owner}</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{hh.id} · {hh.address}</div>
                </div>
                <button onClick={() => setDetailHH(null)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: COLORS.white, width: 32, height: 32, borderRadius: 16, fontSize: 18, cursor: "pointer" }}>×</button>
              </div>
              <div style={{ padding: 24 }}>
                {/* Score ring + key metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "center", marginBottom: 20 }}>
                  <div style={{ width: 110, height: 110, borderRadius: "50%", background: `conic-gradient(${scoreCol} ${hh.score * 3.6}deg, #E0E0E0 0deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 86, height: 86, borderRadius: "50%", background: COLORS.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: 30, fontWeight: 900, color: scoreCol }}>{hh.score}</div>
                      <div style={{ fontSize: 9, color: "#999" }}>de 100</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 11, color: "#888" }}>Estado</div><div style={{ fontWeight: 800, color: scoreCol, fontSize: 15 }}>{hh.status}</div></div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 11, color: "#888" }}>Puntos</div><div style={{ fontWeight: 800, color: COLORS.green, fontSize: 15 }}>{hh.points}</div></div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 11, color: "#888" }}>Penaliz. activas</div><div style={{ fontWeight: 800, color: activePen > 0 ? COLORS.red : COLORS.green, fontSize: 15 }}>{activePen} / {hhPen.length}</div></div>
                    <div style={{ background: "#F5F5F5", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 11, color: "#888" }}>Reconocimientos</div><div style={{ fontWeight: 800, color: COLORS.green, fontSize: 15 }}>{hh.rewards} (+{totalRewPts})</div></div>
                  </div>
                </div>

                {/* Info grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20, fontSize: 13 }}>
                  <div><span style={{ color: "#888" }}>Zona:</span> <b>{hh.zone}</b></div>
                  <div><span style={{ color: "#888" }}>Teléfono:</span> <b>{hh.phone || "N/A"}</b></div>
                  <div><span style={{ color: "#888" }}>IRSU:</span> <b>{irsu ? irsu.name : hh.irsu}</b></div>
                  <div><span style={{ color: "#888" }}>Reciclador:</span> <b>{recycler ? recycler.name : "Por asignar"}</b></div>
                  <div><span style={{ color: "#888" }}>Última auditoría:</span> <b>{hh.lastAudit}</b></div>
                  <div><span style={{ color: "#888" }}>Nivel incentivo:</span> <b>{hh.score >= 95 ? "Platino" : hh.score >= 90 ? "Oro" : hh.score >= 85 ? "Plata" : hh.score >= 75 ? "Bronce" : "Sin nivel"}</b></div>
                </div>

                {/* Penalties */}
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14, marginBottom: 8 }}>⚠️ Penalizaciones ({hhPen.length})</div>
                {hhPen.length ? (
                  <div style={{ marginBottom: 16 }}>{hhPen.map(p => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: p.resolved ? "#F5F5F5" : "#FFF3F3", borderRadius: 6, marginBottom: 4, fontSize: 12 }}>
                      <span>{p.date} · {p.type}</span>
                      <span><Badge text={p.severity} color={p.severity === "Grave" ? COLORS.red : p.severity === "Moderada" ? COLORS.orange : COLORS.gold} /> <Badge text={p.resolved ? "Resuelta" : "Activa"} color={p.resolved ? COLORS.green : COLORS.red} /></span>
                    </div>
                  ))}</div>
                ) : <div style={{ color: "#999", fontSize: 12, marginBottom: 16 }}>Sin penalizaciones.</div>}

                {/* Rewards */}
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14, marginBottom: 8 }}>🏆 Reconocimientos ({hhRew.length})</div>
                {hhRew.length ? (
                  <div style={{ marginBottom: 16 }}>{hhRew.map(r => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", background: "#F1F5EC", borderRadius: 6, marginBottom: 4, fontSize: 12 }}>
                      <span>{r.date} · {r.description}</span>
                      <b style={{ color: COLORS.green }}>+{r.points} pts</b>
                    </div>
                  ))}</div>
                ) : <div style={{ color: "#999", fontSize: 12, marginBottom: 16 }}>Sin reconocimientos.</div>}

                {/* Actions */}
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button onClick={() => { const s = prompt(`Nuevo puntaje para ${hh.owner} (0-100):`, hh.score); if (s !== null) updateHouseholdScore(hh.id, Math.min(100, Math.max(0, parseInt(s)))); }} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${COLORS.blue}`, background: "transparent", color: COLORS.blue, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>📝 Editar Score</button>
                  <button onClick={() => addReward(hh.id, "Bono comunidad", "Reconocimiento por desempeño", 50)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1px solid ${COLORS.green}`, background: "transparent", color: COLORS.green, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>🏆 + Reconocimiento</button>
                  <button onClick={() => generateHouseholdReport(hh)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: COLORS.navy, color: COLORS.white, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>📄 Generar PDF</button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── MODAL NUEVO HOGAR ── */}
      {modal === "addHH" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={() => setModal(null)}>
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 28, width: "90%", maxWidth: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.navy, marginBottom: 16 }}>🏠 Registrar Nuevo Hogar</h3>
            {["owner", "address", "phone", "zone"].map(field => (
              <div key={field} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray, textTransform: "capitalize" }}>{field === "owner" ? "Propietario" : field === "address" ? "Dirección" : field === "phone" ? "Teléfono" : "Zona / Barrio"}</label>
                <input value={formData[field] || ""} onChange={e => setFormData({ ...formData, [field]: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid #CCC`, fontSize: 14, marginTop: 4, boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.gray }}>IRSU Asignado</label>
              <select value={formData.irsu || "IRSU-001"} onChange={e => setFormData({ ...formData, irsu: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CCC", fontSize: 14, marginTop: 4 }}>
                {data.irsus.map(ir => <option key={ir.id} value={ir.id}>{ir.id} — {ir.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setModal(null)} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid #CCC`, background: "transparent", color: COLORS.gray, cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => { if (formData.owner && formData.address) { addHousehold(formData); setModal(null); } else alert("Completa propietario y dirección."); }} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: COLORS.blue, color: COLORS.white, fontWeight: 700, cursor: "pointer" }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "20px 0", fontSize: 11, color: "#AAA", borderTop: "1px solid #EEE", marginTop: 40 }}>
        AZ Neural Grid OS v2.1 · AZ CORPORATION S.A.S. · {new Date().getFullYear()} · Paleta de marca oficial · 9 Módulos
      </div>
    </div>
  );
}




// Simulated household data (in production, fetched from API connected to AZ Neural Grid OS)
const AZ_LOGO_CZ = "data:image/png;base64,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";

const DEMO_HOUSEHOLD = {
  id: "H001", owner: "María García", address: "Cra 19 #14-22, B. Centro",
  zone: "Centro", score: 92, status: "Excelente", points: 450, level: "Oro",
  irsu: { name: "Sandra Morales", phone: "3201234567" },
  recycler: { name: "Pedro López", phone: "3201112233" },
  history: [
    { month: "Enero", score: 85 }, { month: "Febrero", score: 88 },
    { month: "Marzo", score: 90 }, { month: "Abril", score: 87 },
    { month: "Mayo", score: 91 }, { month: "Junio", score: 92 },
  ],
  nextPickup: { green: "Mañana 6:00 AM", white: "Miércoles 6:00 AM", black: "Jueves 6:00 AM" },
  rewards: [
    { date: "2026-06-10", type: "Descuento 15% tarifa aseo", points: -100 },
    { date: "2026-05-15", type: "Bono COP $30.000 comercio local", points: -150 },
    { date: "2026-06-01", type: "+50 puntos clasificación perfecta", points: 50 },
    { date: "2026-05-20", type: "+25 puntos consistencia mensual", points: 25 },
  ],
  notifications: [
    { id: 1, text: "¡Felicidades! Tu puntaje subió a 92. Nivel ORO alcanzado 🏆", time: "Hace 2 días", read: false },
    { id: 2, text: "Próxima recolección de reciclables: miércoles 6:00 AM", time: "Hace 1 día", read: true },
    { id: 3, text: "Nuevo incentivo disponible: sorteo de electrodoméstico para hogares Platino", time: "Hace 3 días", read: false },
  ]
};

const C = {
  green: "#3A5C2E", darkGreen: "#2A4520", lightGreen: "#EAF0E5",
  blue: "#1B3A5C", lightBlue: "#E5EBF0",
  gold: "#4A6B32", lightGold: "#EFF3E8",
  red: "#C62828", lightRed: "#FFEBEE",
  teal: "#2A4520",
  gray: "#37474F", lightGray: "#F5F5F5",
  white: "#FFFFFF", bg: "#FAFBFC",
  navy: "#1B3A5C"
};

function ScoreRing({ score, size = 120 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? C.green : score >= 75 ? C.blue : score >= 60 ? C.gold : C.red;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E0E0E0" strokeWidth={10} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={10} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      <text x={size/2} y={size/2+2} textAnchor="middle" dominantBaseline="middle" style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: size * 0.32, fontWeight: 900, fill: color }}>{score}</text>
    </svg>
  );
}

function AZMiBarrio() {
  const [hh, setHH] = useState(null);
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [loginCode, setLoginCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [publications, setPublications] = useState([]);
  const [pubStatus, setPubStatus] = useState("");
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("az-mi-barrio-user");
        if (result && result.value) {
          setHH(JSON.parse(result.value));
          setLoggedIn(true);
        }
      } catch (e) {}
      try {
        const pr = await window.storage.get("az-ecosystem-publications", true);
        if (pr && pr.value) {
          const parsed = JSON.parse(pr.value);
          if (Array.isArray(parsed)) setPublications(parsed);
          else { await window.storage.set("az-ecosystem-publications", "[]", true); setPublications([]); }
        }
      } catch (e) {
        try { await window.storage.set("az-ecosystem-publications", "[]", true); } catch (e2) {}
        setPublications([]);
      }
      setLoading(false);
    })();
  }, []);

  // Refresh publications when entering the news tab
  const refreshPublications = async () => {
    setPubStatus("Actualizando...");
    try {
      const pr = await window.storage.get("az-ecosystem-publications", true);
      if (pr && pr.value) {
        const parsed = JSON.parse(pr.value);
        const pubs = Array.isArray(parsed) ? parsed : [];
        setPublications(pubs);
        setPubStatus(pubs.length ? `${pubs.length} publicaci\u00f3n(es)` : "Sin publicaciones a\u00fan");
      } else {
        setPublications([]);
        setPubStatus("Sin publicaciones a\u00fan");
      }
    } catch (e) {
      try { await window.storage.set("az-ecosystem-publications", "[]", true); } catch (e2) {}
      setPublications([]);
      setPubStatus("Se limpiaron datos da\u00f1ados. Intenta de nuevo.");
    }
    setTimeout(() => setPubStatus(""), 3000);
  };

  // Guardar publicaciones actualizadas (reacciones/comentarios) en el ecosistema compartido
  const persistPublications = async (pubs) => {
    setPublications(pubs);
    try { await window.storage.set("az-ecosystem-publications", JSON.stringify(pubs), true); }
    catch (e) {
      try {
        const slim = pubs.map(p => (p.fileData && p.fileData.length > 300000) ? { ...p, fileData: "", fileKind: "" } : p);
        await window.storage.set("az-ecosystem-publications", JSON.stringify(slim), true);
        setPublications(slim);
      } catch (e2) {}
    }
  };

  const toggleReaction = async (pubId, emoji) => {
    const userId = hh ? hh.id : "anon";
    const updated = publications.map(p => {
      if (p.id !== pubId) return p;
      const reactions = { ...(p.reactions || {}) };
      const users = { ...(p.reactionUsers || {}) };
      const myReaction = users[userId];
      // Quitar reacción previa del usuario
      if (myReaction && reactions[myReaction]) reactions[myReaction] = Math.max(0, reactions[myReaction] - 1);
      if (myReaction === emoji) {
        delete users[userId]; // si toca el mismo, lo quita
      } else {
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        users[userId] = emoji;
      }
      return { ...p, reactions, reactionUsers: users };
    });
    await persistPublications(updated);
  };

  const addComment = async (pubId) => {
    const text = (commentText[pubId] || "").trim();
    if (!text) return;
    const userId = hh ? hh.id : "anon";
    const userName = hh ? (hh.owner || hh.id) : "Ciudadano";
    const updated = publications.map(p => {
      if (p.id !== pubId) return p;
      const comments = [...(p.comments || []), { id: `C${Date.now()}`, user: userName, userId, text, date: new Date().toISOString() }];
      return { ...p, comments };
    });
    await persistPublications(updated);
    setCommentText(ct => ({ ...ct, [pubId]: "" }));
  };

  const handleLogin = async () => {
    // Demo: any code starting with "H" logs in
    if (loginCode.toUpperCase().startsWith("H") || loginCode === "demo") {
      const userData = { ...DEMO_HOUSEHOLD, id: loginCode.toUpperCase() || "H001" };
      setHH(userData);
      setLoggedIn(true);
      try { await window.storage.set("az-mi-barrio-user", JSON.stringify(userData)); } catch(e) {}
    } else {
      alert("Código no válido. Use el código QR de su Kit AZ o escriba 'demo' para probar.");
    }
  };

  const handleLogout = async () => {
    setLoggedIn(false); setHH(null); setTab("home");
    try { await window.storage.delete("az-mi-barrio-user"); } catch(e) {}
  };

  const generateMyReport = () => {
    const win = window.open("", "_blank");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mi Reporte - ${hh.owner}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #37474F; padding: 40px; max-width: 700px; margin: 0 auto; }
      .header { border-bottom: 3px solid #3A5C2E; padding-bottom: 16px; margin-bottom: 24px; }
      .brand { font-size: 22px; font-weight: 900; color: #1B3A5C; } .brand span { color: #3A5C2E; }
      .sub { font-size: 11px; color: #7A8A8A; letter-spacing: 2px; }
      h1 { color: #3A5C2E; font-size: 17px; margin: 20px 0 8px; }
      .scorebox { display:flex; gap:16px; margin:16px 0; }
      .card { flex:1; background:#EAF0E5; border-radius:8px; padding:16px; text-align:center; }
      .card .v { font-size:30px; font-weight:900; color:#3A5C2E; }
      .card .l { font-size:10px; color:#888; text-transform:uppercase; }
      table { width:100%; border-collapse:collapse; margin:12px 0; }
      th { background:#3A5C2E; color:#fff; padding:8px; font-size:12px; text-align:left; }
      td { padding:8px; border-bottom:1px solid #eee; font-size:12px; }
      .bar { display:flex; align-items:flex-end; gap:6px; height:80px; margin:12px 0; }
      .bar .col { flex:1; text-align:center; }
      .bar .fill { background:#3A5C2E; border-radius:4px 4px 0 0; margin-top:4px; }
      .foot { margin-top:40px; padding-top:16px; border-top:1px solid #ccc; font-size:10px; color:#aaa; text-align:center; }
      @media print { button { display:none; } }
    </style></head><body>
    <div class="header"><div class="brand">AZ <span>CORPORATION</span></div><div class="sub">MI BARRIO · REPORTE DE PROGRESO</div>
    <div style="font-size:11px;color:#888;margin-top:4px">Generado: ${new Date().toLocaleDateString("es-CO")}</div></div>
    <h1>Mi Hogar</h1>
    <table><tr><td><b>Propietario</b></td><td>${hh.owner}</td></tr>
    <tr><td><b>Dirección</b></td><td>${hh.address}</td></tr>
    <tr><td><b>Nivel actual</b></td><td>${hh.status} · Nivel ${hh.level}</td></tr></table>
    <div class="scorebox">
      <div class="card"><div class="v">${hh.score}</div><div class="l">Mi puntaje</div></div>
      <div class="card"><div class="v" style="color:#1B3A5C">${hh.points}</div><div class="l">Mis puntos</div></div>
    </div>
    <h1>Mi Evolución (6 meses)</h1>
    <div class="bar">${hh.history.map(h=>`<div class="col"><div style="font-size:11px;font-weight:700;color:#3A5C2E">${h.score}</div><div class="fill" style="height:${h.score*0.6}%"></div><div style="font-size:9px;color:#aaa;margin-top:2px">${h.month.slice(0,3)}</div></div>`).join("")}</div>
    <h1>Historial de Puntos</h1>
    <table><tr><th>Fecha</th><th>Concepto</th><th>Puntos</th></tr>
    ${hh.rewards.map(r=>`<tr><td>${r.date}</td><td>${r.type}</td><td style="color:${r.points>0?"#3A5C2E":"#B71C1C"}">${r.points>0?"+":""}${r.points}</td></tr>`).join("")}</table>
    <div class="foot">AZ CORPORATION S.A.S. · Gracias por cuidar tu barrio · Transformamos residuos en futuro</div>
    <button onclick="window.print()" style="margin-top:24px;padding:10px 24px;background:#3A5C2E;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer">🖨️ Imprimir / Guardar PDF</button>
    </body></html>`;
    win.document.write(html); win.document.close();
  };


  if (loading) return <div style={{ display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",fontFamily:"system-ui",color:C.green }}>Cargando...</div>;

  // ── LOGIN SCREEN ──
  if (!loggedIn) {
    return (
      <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:`linear-gradient(135deg,${C.darkGreen},${C.green})`, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:24 }}>
        <div style={{ width:80,height:80,borderRadius:16,background:C.white,display:"flex",alignItems:"center",justifyContent:"center",padding:8,marginBottom:16 }}><img src={AZ_LOGO_CZ} alt="AZ" style={{ height:"100%",objectFit:"contain" }} /></div>
        <div style={{ color:C.white,fontWeight:800,fontSize:28,marginBottom:4 }}>AZ Mi Barrio</div>
        <div style={{ color:"#A5D6A7",fontSize:14,marginBottom:40 }}>Tu hogar, tu puntaje, tu comunidad</div>
        <div style={{ background:C.white,borderRadius:20,padding:32,width:"100%",maxWidth:360,boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ fontWeight:700,fontSize:16,color:C.navy,marginBottom:16,textAlign:"center" }}>Ingresa tu código de hogar</div>
          <input value={loginCode} onChange={e => setLoginCode(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder='Ej: H001 o escribe "demo"' style={{ width:"100%",padding:"12px 16px",borderRadius:12,border:`2px solid ${C.green}`,fontSize:16,textAlign:"center",fontWeight:700,boxSizing:"border-box",outline:"none" }} />
          <button onClick={handleLogin} style={{ width:"100%",padding:"14px 0",borderRadius:12,border:"none",background:C.green,color:C.white,fontWeight:800,fontSize:16,cursor:"pointer",marginTop:12 }}>Ingresar</button>
          <div style={{ textAlign:"center",fontSize:12,color:"#999",marginTop:16 }}>Escanea el código QR de tu Kit AZ o ingresa tu código de hogar</div>
        </div>
      </div>
    );
  }

  const scoreColor = hh.score >= 90 ? C.green : hh.score >= 75 ? C.blue : hh.score >= 60 ? C.gold : C.red;
  const unread = hh.notifications.filter(n => !n.read).length;

  const NavBtn = ({ icon, label, id }) => (
    <button onClick={() => { setTab(id); if (id === "news") refreshPublications(); }} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px 0",border:"none",background:"transparent",cursor:"pointer",color:tab===id?C.green:"#999",fontWeight:tab===id?700:400,fontSize:11,position:"relative" }}>
      <span style={{ fontSize:20 }}>{icon}</span>
      {label}
      {id === "alerts" && unread > 0 && <span style={{ position:"absolute",top:4,right:"calc(50% - 16px)",width:16,height:16,borderRadius:8,background:C.red,color:C.white,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>{unread}</span>}
    </button>
  );

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif",background:C.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative" }}>
      {/* HEADER */}
      <div style={{ background:`linear-gradient(135deg,${C.darkGreen},${C.green})`,padding:"16px 20px",borderRadius:"0 0 24px 24px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:34,height:34,borderRadius:8,background:C.white,display:"flex",alignItems:"center",justifyContent:"center",padding:3 }}><img src={AZ_LOGO_CZ} alt="AZ" style={{ height:"100%",objectFit:"contain" }} /></div>
            <div>
              <div style={{ color:C.white,fontWeight:700,fontSize:15 }}>Hola, {hh.owner.split(" ")[0]} 👋</div>
              <div style={{ color:"#A5D6A7",fontSize:11 }}>{hh.address}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding:"4px 10px",borderRadius:6,border:"1px solid rgba(255,255,255,0.3)",background:"transparent",color:"#A5D6A7",fontSize:11,cursor:"pointer" }}>Salir</button>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding:"16px 16px 80px" }}>

        {/* HOME */}
        {tab === "home" && (
          <div>
            {/* Score card */}
            <div style={{ background:C.white,borderRadius:20,padding:24,textAlign:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.06)",marginBottom:16 }}>
              <div style={{ fontSize:13,fontWeight:600,color:C.gray,marginBottom:8 }}>Tu Puntaje de Clasificación</div>
              <ScoreRing score={hh.score} size={130} />
              <div style={{ marginTop:8,display:"inline-block",padding:"4px 16px",borderRadius:20,background:scoreColor+"18",color:scoreColor,fontWeight:800,fontSize:14 }}>{hh.status} · Nivel {hh.level}</div>
            </div>

            {/* Quick stats */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
              <div style={{ background:C.white,borderRadius:14,padding:16,textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:11,color:"#888" }}>Tus Puntos</div>
                <div style={{ fontSize:28,fontWeight:900,color:C.gold }}>{hh.points}</div>
                <div style={{ fontSize:10,color:"#AAA" }}>Canjeables por descuentos</div>
              </div>
              <div style={{ background:C.white,borderRadius:14,padding:16,textAlign:"center",boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:11,color:"#888" }}>Tu IRSU</div>
                <div style={{ fontSize:14,fontWeight:700,color:C.navy,marginTop:4 }}>{hh.irsu.name}</div>
                <div style={{ fontSize:11,color:C.green,marginTop:2 }}>📞 {hh.irsu.phone}</div>
              </div>
            </div>

            {/* Next pickup */}
            <div style={{ background:C.white,borderRadius:14,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.04)",marginBottom:16 }}>
              <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10 }}>📅 Próximas Recolecciones</div>
              {[
                { icon:"🟢",label:"Orgánicos",time:hh.nextPickup.green,color:C.green },
                { icon:"⚪",label:"Reciclables",time:hh.nextPickup.white,color:C.blue },
                { icon:"⚫",label:"No aprovechables",time:hh.nextPickup.black,color:C.gray },
              ].map(p => (
                <div key={p.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #F0F0F0" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontSize:18 }}>{p.icon}</span>
                    <span style={{ fontSize:13,fontWeight:600,color:C.gray }}>{p.label}</span>
                  </div>
                  <span style={{ fontSize:13,fontWeight:700,color:p.color }}>{p.time}</span>
                </div>
              ))}
            </div>

            {/* Score history mini chart */}
            <div style={{ background:C.white,borderRadius:14,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
              <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10 }}>📈 Tu Evolución</div>
              <div style={{ display:"flex",alignItems:"flex-end",gap:6,height:80 }}>
                {hh.history.map((h,i) => {
                  const color = h.score >= 90 ? C.green : h.score >= 75 ? C.blue : C.gold;
                  return (
                    <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center" }}>
                      <div style={{ fontSize:10,fontWeight:700,color,marginBottom:2 }}>{h.score}</div>
                      <div style={{ width:"100%",maxWidth:30,height:`${h.score * 0.7}%`,background:`linear-gradient(180deg,${color},${color}88)`,borderRadius:"4px 4px 0 0",minHeight:4 }} />
                      <div style={{ fontSize:9,color:"#BBB",marginTop:2 }}>{h.month.slice(0,3)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={generateMyReport} style={{ width:"100%", marginTop:16, padding:"14px 0", borderRadius:14, border:"none", background:C.green, color:C.white, fontWeight:800, fontSize:15, cursor:"pointer" }}>📄 Descargar Mi Reporte (PDF)</button>
          </div>
        )}

        {/* GUIDE */}
        {tab === "guide" && (
          <div>
            <div style={{ fontWeight:800,fontSize:18,color:C.navy,marginBottom:16 }}>♻️ ¿Cómo clasificar tus residuos?</div>

            {[
              { icon:"🟢",title:"Bolsa VERDE — Orgánicos",color:C.green,bg:C.lightGreen,
                yes:["Restos de comida y cáscaras","Frutas y verduras","Residuos de poda (hojas, ramas)","Cáscaras de huevo","Servilletas sucias con alimentos"],
                no:["Aceites de cocina usados","Huesos grandes","Pañales","Colillas de cigarrillo","Excrementos de mascotas"] },
              { icon:"⚪",title:"Bolsa BLANCA — Reciclables",color:C.blue,bg:C.lightBlue,
                yes:["Papel y cartón limpio","Botellas PET limpias","Vidrio (botellas, frascos)","Latas de aluminio","Envases Tetra Pak limpios"],
                no:["Papel higiénico","Cartón con grasa","Envases sucios sin lavar","Vidrio roto suelto","Bombillos"] },
              { icon:"⚫",title:"Bolsa NEGRA — Todo lo demás",color:C.gray,bg:C.lightGray,
                yes:["Plásticos sucios o mezclados","Icopor y multicapas","Pañales y papel higiénico","Cauchos y suelas","Mezclas que no puedas separar"],
                no:["Baterías y pilas (punto ecológico)","Medicamentos vencidos (farmacia)","Electrónicos (punto RAEE)","Aceite de cocina (recolección especial)","Escombros (servicio especial)"] },
            ].map(bag => (
              <div key={bag.title} style={{ background:bag.bg,borderRadius:16,padding:16,marginBottom:12,border:`2px solid ${bag.color}22` }}>
                <div style={{ fontWeight:800,fontSize:15,color:bag.color,marginBottom:10 }}>{bag.icon} {bag.title}</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                  <div>
                    <div style={{ fontSize:11,fontWeight:700,color:C.green,marginBottom:4 }}>✅ SÍ va aquí:</div>
                    {bag.yes.map(item => <div key={item} style={{ fontSize:12,color:C.gray,padding:"2px 0" }}>• {item}</div>)}
                  </div>
                  <div>
                    <div style={{ fontSize:11,fontWeight:700,color:C.red,marginBottom:4 }}>❌ NO va aquí:</div>
                    {bag.no.map(item => <div key={item} style={{ fontSize:12,color:"#999",padding:"2px 0" }}>• {item}</div>)}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background:"#FFF3E0",borderRadius:12,padding:14,border:`2px solid ${C.gold}22`,marginTop:8 }}>
              <div style={{ fontWeight:700,fontSize:13,color:C.gold }}>💡 Tip AZ</div>
              <div style={{ fontSize:12,color:C.gray,marginTop:4 }}>¿No sabes dónde va? Ponlo en la <b>bolsa negra</b>. Nuestro equipo en el CCAR lo clasificará correctamente. ¡Es mejor equivocarse en la negra que contaminar la verde o la blanca!</div>
            </div>
          </div>
        )}

        {/* POINTS */}
        {tab === "points" && (
          <div>
            <div style={{ fontWeight:800,fontSize:18,color:C.navy,marginBottom:16 }}>🏆 Mis Puntos y Reconocimientos</div>
            
            <div style={{ background:`linear-gradient(135deg,${C.gold},#FFB300)`,borderRadius:16,padding:20,color:C.white,textAlign:"center",marginBottom:16,boxShadow:"0 4px 16px rgba(249,168,37,0.3)" }}>
              <div style={{ fontSize:13,opacity:0.9 }}>Puntos Disponibles</div>
              <div style={{ fontSize:44,fontWeight:900 }}>{hh.points}</div>
              <div style={{ fontSize:12,opacity:0.8,marginTop:4 }}>Nivel {hh.level} · Siguiente nivel: {hh.level === "Oro" ? "Platino (score ≥ 95)" : "Oro (score ≥ 90)"}</div>
            </div>

            <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10 }}>Historial de Movimientos</div>
            {hh.rewards.map((r,i) => (
              <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",background:C.white,borderRadius:10,padding:"12px 14px",marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div>
                  <div style={{ fontSize:13,fontWeight:600,color:C.gray }}>{r.type}</div>
                  <div style={{ fontSize:11,color:"#999" }}>{r.date}</div>
                </div>
                <div style={{ fontWeight:800,fontSize:16,color:r.points > 0 ? C.green : C.red }}>{r.points > 0 ? "+" : ""}{r.points}</div>
              </div>
            ))}

            <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10,marginTop:20 }}>Canjear Puntos</div>
            {[
              { name:"5% descuento tarifa aseo",cost:100,icon:"🏷️" },
              { name:"Bono COP $15.000 comercio local",cost:200,icon:"🛍️" },
              { name:"Bono COP $30.000 comercio local",cost:350,icon:"🎁" },
              { name:"Participar en sorteo electrodoméstico",cost:500,icon:"📺" },
            ].map(item => (
              <div key={item.name} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",background:C.white,borderRadius:10,padding:"12px 14px",marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <span style={{ fontSize:24 }}>{item.icon}</span>
                  <div style={{ fontSize:13,fontWeight:600,color:C.gray }}>{item.name}</div>
                </div>
                <button disabled={hh.points < item.cost} style={{ padding:"6px 14px",borderRadius:8,border:"none",background:hh.points >= item.cost ? C.green : "#E0E0E0",color:hh.points >= item.cost ? C.white : "#999",fontWeight:700,fontSize:12,cursor:hh.points >= item.cost ? "pointer" : "default" }}>{item.cost} pts</button>
              </div>
            ))}
          </div>
        )}

        {/* NEWS / ECOSYSTEM */}
        {tab === "news" && (
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4 }}>
              <div style={{ fontWeight:800,fontSize:18,color:C.navy }}>📢 Novedades AZ CORPORATION</div>
              <button onClick={refreshPublications} style={{ padding:"6px 14px",borderRadius:20,border:`1px solid ${C.green}`,background:C.white,color:C.green,fontSize:12,fontWeight:700,cursor:"pointer" }}>🔄 Actualizar</button>
            </div>
            <div style={{ fontSize:12,color:"#888",marginBottom:8 }}>Anuncios, campañas y contenido de tu operador</div>
            {pubStatus && <div style={{ fontSize:11,color:C.green,marginBottom:12,fontStyle:"italic" }}>{pubStatus}</div>}
            {publications.length === 0 ? (
              <div style={{ textAlign:"center",padding:40,color:"#999" }}>
                <div style={{ fontSize:40,marginBottom:8 }}>📭</div>
                <div style={{ fontSize:14 }}>No hay publicaciones por ahora</div>
                <div style={{ fontSize:12,marginTop:4 }}>Vuelve pronto para ver novedades</div>
              </div>
            ) : (
              publications.map(pub => {
                const typeIcons = { anuncio:"📣", video:"🎬", "campaña":"📢", educativo:"📚", evento:"📅" };
                const typeColors = { anuncio:C.blue, video:C.red, "campaña":C.green, educativo:C.teal, evento:C.gold };
                const getYtId = (url) => {
                  if (!url) return null;
                  const patterns = [
                    /youtube\.com\/watch\?v=([^&]+)/,
                    /youtu\.be\/([^?&]+)/,
                    /youtube\.com\/embed\/([^?&]+)/,
                    /youtube\.com\/shorts\/([^?&]+)/,
                    /youtube\.com\/live\/([^?&]+)/,
                  ];
                  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
                  return null;
                };
                const ytId = getYtId(pub.media);
                const isImage = pub.media && /\.(jpg|jpeg|png|gif|webp)$/i.test(pub.media);
                return (
                  <div key={pub.id} style={{ background:C.white,borderRadius:14,padding:16,marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",borderTop:`3px solid ${typeColors[pub.type]||C.blue}` }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                      <span style={{ fontSize:20 }}>{typeIcons[pub.type]||"📣"}</span>
                      <span style={{ fontWeight:800,color:C.navy,fontSize:15,flex:1 }}>{pub.title}</span>
                    </div>
                    <div style={{ fontSize:13,color:C.gray,lineHeight:1.5,marginBottom:10 }}>{pub.body}</div>
                    {ytId && (
                      <div style={{ marginBottom:8 }}>
                        <div style={{ position:"relative",paddingBottom:"56.25%",height:0,borderRadius:10,overflow:"hidden" }}>
                          <iframe src={`https://www.youtube-nocookie.com/embed/${ytId}`} title={pub.title} style={{ position:"absolute",top:0,left:0,width:"100%",height:"100%",border:"none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
                        </div>
                        <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noreferrer" style={{ display:"inline-block",marginTop:6,fontSize:12,color:C.red,fontWeight:600 }}>▶️ Ver en YouTube (si no carga arriba)</a>
                      </div>
                    )}
                    {pub.media && !ytId && (pub.media.includes("youtube") || pub.media.includes("youtu.be")) && (
                      <a href={pub.media} target="_blank" rel="noreferrer" style={{ display:"block",padding:"12px",background:"#FFF0F0",borderRadius:10,marginBottom:8,color:C.red,fontWeight:600,fontSize:13,textAlign:"center" }}>▶️ Ver video en YouTube</a>
                    )}
                    {isImage && <img src={pub.media} alt={pub.title} style={{ width:"100%",borderRadius:10,marginBottom:8 }} />}
                    {pub.fileKind === "image" && pub.fileData && <img src={pub.fileData} alt={pub.fileName} style={{ width:"100%",borderRadius:10,marginBottom:8 }} />}
                    {pub.fileKind === "pdf" && pub.fileData && (
                      <a href={pub.fileData} download={pub.fileName} style={{ display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#FFF0F0",borderRadius:10,marginBottom:8,textDecoration:"none",color:C.red,fontWeight:600,fontSize:13 }}>📄 Descargar: {pub.fileName}</a>
                    )}
                    {pub.fileKind === "audio" && pub.fileData && (
                      <div style={{ background:C.lightGreen,borderRadius:10,padding:"10px 12px",marginBottom:8 }}>
                        <div style={{ fontSize:12,fontWeight:600,color:C.green,marginBottom:6 }}>🎵 {pub.fileName}</div>
                        <audio controls src={pub.fileData} style={{ width:"100%" }} />
                      </div>
                    )}
                    {pub.fileKind === "video" && pub.fileData && (
                      <video controls src={pub.fileData} style={{ width:"100%",borderRadius:10,marginBottom:8 }} />
                    )}
                    {pub.fileKind === "audio" && pub.fileData && (
                      <div style={{ background:"#EAF0E5",borderRadius:10,padding:10,marginBottom:8 }}>
                        <div style={{ fontSize:12,fontWeight:600,color:C.green,marginBottom:6 }}>🎵 {pub.fileName}</div>
                        <audio controls src={pub.fileData} style={{ width:"100%" }} />
                      </div>
                    )}
                    {pub.fileKind === "video" && pub.fileData && (
                      <video controls src={pub.fileData} style={{ width:"100%",borderRadius:10,marginBottom:8 }} />
                    )}
                    {pub.media && !ytId && !isImage && (
                      <a href={pub.media} target="_blank" rel="noreferrer" style={{ display:"inline-block",fontSize:13,color:C.blue,fontWeight:600 }}>🔗 Ver más</a>
                    )}
                    <div style={{ fontSize:11,color:"#aaa",marginTop:6 }}>{new Date(pub.date).toLocaleDateString("es-CO")} · {pub.author}</div>

                    {/* Botón de descarga de pieza (imagen/PDF/audio) */}
                    {pub.fileData && pub.fileKind && (
                      <a href={pub.fileData} download={pub.fileName || "pieza-az"} style={{ display:"inline-flex",alignItems:"center",gap:6,marginTop:8,padding:"6px 12px",background:C.lightGreen,borderRadius:20,color:C.green,fontSize:12,fontWeight:700,textDecoration:"none" }}>⬇️ Descargar pieza</a>
                    )}

                    {/* Reacciones con emojis */}
                    <div style={{ display:"flex",gap:6,marginTop:12,flexWrap:"wrap",borderTop:"1px solid #F0F0F0",paddingTop:10 }}>
                      {["👍","❤️","🌱","👏","💡"].map(emoji => {
                        const count = (pub.reactions && pub.reactions[emoji]) || 0;
                        const mine = pub.reactionUsers && pub.reactionUsers[hh ? hh.id : "anon"] === emoji;
                        return (
                          <button key={emoji} onClick={() => toggleReaction(pub.id, emoji)} style={{ display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:16,border:mine ? `1.5px solid ${C.green}` : "1px solid #E0E0E0",background:mine ? C.lightGreen : C.white,cursor:"pointer",fontSize:14 }}>
                            <span>{emoji}</span>
                            {count > 0 && <span style={{ fontSize:12,fontWeight:700,color:mine ? C.green : "#888" }}>{count}</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Comentarios */}
                    <div style={{ marginTop:10 }}>
                      {(pub.comments || []).length > 0 && (
                        <div style={{ marginBottom:8 }}>
                          {(pub.comments || []).map(cm => (
                            <div key={cm.id} style={{ background:"#F7F7F7",borderRadius:10,padding:"8px 12px",marginBottom:6 }}>
                              <div style={{ fontSize:12,fontWeight:700,color:C.navy }}>{cm.user}</div>
                              <div style={{ fontSize:13,color:C.gray }}>{cm.text}</div>
                              <div style={{ fontSize:10,color:"#bbb",marginTop:2 }}>{new Date(cm.date).toLocaleDateString("es-CO")}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div style={{ display:"flex",gap:6 }}>
                        <input value={commentText[pub.id] || ""} onChange={e => setCommentText(ct => ({ ...ct, [pub.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && addComment(pub.id)} placeholder="Escribe un comentario..." style={{ flex:1,padding:"8px 12px",borderRadius:20,border:"1px solid #E0E0E0",fontSize:13,outline:"none" }} />
                        <button onClick={() => addComment(pub.id)} style={{ padding:"8px 14px",borderRadius:20,border:"none",background:C.green,color:C.white,fontWeight:700,fontSize:13,cursor:"pointer" }}>Enviar</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ALERTS */}
        {tab === "alerts" && (
          <div>
            <div style={{ fontWeight:800,fontSize:18,color:C.navy,marginBottom:16 }}>🔔 Notificaciones</div>
            {hh.notifications.map(n => (
              <div key={n.id} style={{ background:n.read ? C.white : C.lightGreen,borderRadius:12,padding:14,marginBottom:8,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",borderLeft:`4px solid ${n.read ? "#E0E0E0" : C.green}` }}>
                <div style={{ fontSize:13,color:C.gray,fontWeight:n.read ? 400 : 700 }}>{n.text}</div>
                <div style={{ fontSize:11,color:"#999",marginTop:4 }}>{n.time}</div>
              </div>
            ))}

            <div style={{ fontWeight:700,fontSize:14,color:C.navy,marginBottom:10,marginTop:24 }}>📞 Contacto Directo</div>
            <div style={{ background:C.white,borderRadius:12,padding:14,boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F0F0F0" }}>
                <span style={{ fontSize:13 }}>Tu Inspector IRSU</span>
                <span style={{ fontSize:13,fontWeight:700,color:C.green }}>{hh.irsu.name} · {hh.irsu.phone}</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #F0F0F0" }}>
                <span style={{ fontSize:13 }}>Tu Reciclador</span>
                <span style={{ fontSize:13,fontWeight:700,color:C.blue }}>{hh.recycler.name} · {hh.recycler.phone}</span>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",padding:"8px 0" }}>
                <span style={{ fontSize:13 }}>Línea AZ Corporation</span>
                <span style={{ fontSize:13,fontWeight:700,color:C.navy }}>01 8000 AZ CORP</span>
              </div>
            </div>

            <button onClick={() => { const msg = prompt("Describe tu reporte o solicitud:"); if(msg) alert("Reporte enviado exitosamente. Tu IRSU lo revisará en las próximas 24 horas. Gracias."); }} style={{ width:"100%",padding:"14px 0",borderRadius:12,border:"none",background:C.green,color:C.white,fontWeight:800,fontSize:15,cursor:"pointer",marginTop:16 }}>📝 Enviar Reporte o Solicitud</button>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.white,borderTop:"1px solid #E0E0E0",display:"flex",padding:"4px 0 8px",zIndex:100,boxShadow:"0 -2px 10px rgba(0,0,0,0.05)" }}>
        <NavBtn icon="🏠" label="Inicio" id="home" />
        <NavBtn icon="♻️" label="Clasificar" id="guide" />
        <NavBtn icon="🏆" label="Puntos" id="points" />
        <NavBtn icon="📢" label="Novedades" id="news" />
        <NavBtn icon="🔔" label="Alertas" id="alerts" />
      </div>
    </div>
  );
}


// ============================================================
// WRAPPER PRINCIPAL — Selector de modo
// ============================================================
export default function AZEcosistema() {
  const [mode, setMode] = useState(null);

  // Barra superior de cambio de modo (clara y siempre visible)
  const ModeBar = ({ color, label, otherLabel, otherMode }) => (
    <div style={{ position: "sticky", top: 0, zIndex: 9999, background: color, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", borderBottom: "2px solid rgba(255,255,255,0.2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setMode(null)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>← Menú</button>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Modo: {label}</span>
      </div>
      <button onClick={() => setMode(otherMode)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "#fff", color: color, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>⇄ Ir a {otherLabel}</button>
    </div>
  );

  if (mode === "operador") {
    return (
      <div>
        <ModeBar color="#1B3A5C" label="Operador (AZ CORP)" otherLabel="Ciudadano" otherMode="ciudadano" />
        <AZNeuralGridOS />
      </div>
    );
  }
  if (mode === "ciudadano") {
    return (
      <div>
        <ModeBar color="#3A5C2E" label="Ciudadano (Mi Barrio)" otherLabel="Operador" otherMode="operador" />
        <AZMiBarrio />
      </div>
    );
  }

  // Mode selector screen
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #1B3A5C, #3A5C2E)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24 }}>
      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "40px 32px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center" }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#1B3A5C", letterSpacing: 2 }}>AZ <span style={{ color: "#3A5C2E" }}>CORPORATION</span></div>
        <div style={{ fontSize: 12, color: "#7A8A8A", letterSpacing: 3, marginBottom: 8 }}>ECOSISTEMA DIGITAL</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 32 }}>Selecciona el modo de acceso</div>

        <button onClick={() => setMode("operador")} style={{ width: "100%", padding: "20px", borderRadius: 16, border: "2px solid #1B3A5C", background: "#1B3A5C", color: "#fff", cursor: "pointer", marginBottom: 16, textAlign: "left", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 32 }}>🖥️</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>AZ Neural Grid OS</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Operador · IRSU, CCAR, supervisores</div>
          </div>
        </button>

        <button onClick={() => setMode("ciudadano")} style={{ width: "100%", padding: "20px", borderRadius: 16, border: "2px solid #3A5C2E", background: "#3A5C2E", color: "#fff", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 32 }}>📱</span>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>AZ Mi Barrio</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Ciudadano · Hogares de Arauca</div>
          </div>
        </button>

        <div style={{ fontSize: 11, color: "#aaa", marginTop: 24 }}>Las publicaciones creadas en modo Operador aparecen en modo Ciudadano · Ecosistema compartido</div>
      </div>
    </div>
  );
}
