import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { CommandV2 } from "../../CommandInterface";
import { EmbedBuilder } from "@discordjs/builders";

export type GeminiResponse = {
  responseId: string,
  content: string,
  language: string,
}

export type RotateCookiePageResponse = {
  codeNeededToRotateCookies: number,
  rotateCode: number,
}

const rawCookies = `
APISID=NblISnlt_7IWnY-c/AXrnSHFX8CjP6rw_L;
__Secure-1PAPISID=NblISnlt_7IWnY-c/AXrnSHFX8CjP6rw_L;
__Secure-3PAPISID=NblISnlt_7IWnY-c/AXrnSHFX8CjP6rw_L;
SID=g.a000lAis0DZFcraOY0dv9N7Q2MbswjaCh6LpAhbY3wkSmAN_IRfTlsJY8TUXynmFl13g4c_DOAACgYKAasSARUSFQHGX2MiS7NG4QnbMLRbjEp2pWm-QhoVAUF8yKov2eOcJO8N8hbvSxZdqsWJ0076; 
__Secure-1PSID=g.a000lAis0DZFcraOY0dv9N7Q2MbswjaCh6LpAhbY3wkSmAN_IRfTVM6x8J9IrxFK7pPrnmPQ5gACgYKAcYSARUSFQHGX2Mi6KV0HbGHbfM8-OZVJvJGmBoVAUF8yKrHJHsdDU5vTJhj4dUixiC70076; __Secure-3PSID=g.a000lAis0DZFcraOY0dv9N7Q2MbswjaCh6LpAhbY3wkSmAN_IRfTwxNJ0EDaUsybBhK6Ta6W_wACgYKAeYSARUSFQHGX2Mi2iIDwMr5P0r5rG0jKKo_qRoVAUF8yKrhVF-obHqYPltt_ySNAmp20076; 
__Secure-1PSIDTS=sidts-CjIB4E2dkewQ8n68ujccbfnSaHVyFhVa8pGQyIBYL4iY2DG0WMo6n_L_jjtuf7Xi4igXPxAA; 
__Secure-3PSIDTS=sidts-CjIB4E2dkewQ8n68ujccbfnSaHVyFhVa8pGQyIBYL4iY2DG0WMo6n_L_jjtuf7Xi4igXPxAA; 
__Secure-1PSIDCC=AKEyXzVyIp-Q9uc4E7xUy_8BxzjfSZKPpt0jDumBQfli_nSJKo3WrP9vJJKQFphrNko6djesPXw; 
__Secure-3PSIDCC=AKEyXzV4rCMQXk2KyL6zOHYVbL0V1g7TLX9OhYco0Zx6wqtTU3waK9v0Awt8d0Yux6DXqGGpleQ
`
const ERROR_MESSAGE = "An error has occurred while communicating with Gemini! This error has been reported!"

let cookies = rawCookies.replaceAll(" ", "").replaceAll("\n", "").split(";")

async function getStuffForRotatingCookies(): Promise<RotateCookiePageResponse> {
  const response = await fetch("https://accounts.google.com/RotateCookiesPage?og_pid=658&rot=3&origin=https%3A%2F%2Fgemini.google.com&exp_id=0", {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9,uk-UA;q=0.8,uk;q=0.7",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "priority": "u=0, i",
      "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
      "sec-ch-ua-arch": "\"x86\"",
      "sec-ch-ua-bitness": "\"64\"",
      "sec-ch-ua-form-factors": "\"Desktop\"",
      "sec-ch-ua-full-version": "\"126.0.6478.127\"",
      "sec-ch-ua-full-version-list": "\"Not/A)Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"126.0.6478.127\", \"Google Chrome\";v=\"126.0.6478.127\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-model": "\"\"",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-ch-ua-platform-version": "\"15.0.0\"",
      "sec-ch-ua-wow64": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "upgrade-insecure-requests": "1",
      "x-chrome-id-consistency-request": "version=1,client_id=77185425430.apps.googleusercontent.com,device_id=cc376c1e-5635-429b-8d6c-9a8297456529,sync_account_id=111179095034996224124,signin_mode=all_accounts,signout_mode=show_confirmation",
      "x-client-data": "CJO2yQEIorbJAQipncoBCPDjygEIlaHLAQid/swBCIWgzQEIvYXOAQjGnc4BCP+gzgEIpqLOAQjjpc4BCOKnzgEImqjOARj1yc0BGNfrzQEYoZ3OARivn84BGPyjzgE=",
      "Cookie": "SMSV=ADHTe-Cta5RzQ1WHKmFHkjE9Zm9JCYzrqh5ARRZc--YBzwmfpSJCmAap_LhU3AI52apr53jh1aPs50ryddp1ytuGYktA6WCfjpaIJC8XYaiNP6U1M8kVMZM; ACCOUNT_CHOOSER=AFx_qI4hIjOdA8VWOVer2xeaIKJTseu3qUxIALgfPv3KWrvf_9Hx7I4wSsXpCZpQj48eFoLswurSdBfDtNTfxpiVy4h1NvSTYtz6SAETgIIBwVime1TNvxv1DsNwou2aU2j8Fk_SoF2lq63MPuO6F9jwM366AY-v6Z_NZY9qRPmhB0qPmbJ_DF1FK2D672nRo4aFlt2nFRKgeHvpff248k_2cBlswsYL_u54e_oU_xSGhp2Y61322Q5cedD9twynvgkau6IanRCoWbcvlw3DCfiEAFXvt-EVLg; HSID=AC85wzo5iy2tLdcZ1; SSID=AkCxWP3OiPUiNdtzE; APISID=JE7mJBJ8ldEruMF1/AEBjVgVQPXMJR9A5d; SAPISID=NblISnlt_7IWnY-c/AXrnSHFX8CjP6rw_L; __Secure-1PAPISID=NblISnlt_7IWnY-c/AXrnSHFX8CjP6rw_L; __Secure-3PAPISID=NblISnlt_7IWnY-c/AXrnSHFX8CjP6rw_L; SID=g.a000lAis0DZFcraOY0dv9N7Q2MbswjaCh6LpAhbY3wkSmAN_IRfTlsJY8TUXynmFl13g4c_DOAACgYKAasSARUSFQHGX2MiS7NG4QnbMLRbjEp2pWm-QhoVAUF8yKov2eOcJO8N8hbvSxZdqsWJ0076; __Secure-1PSID=g.a000lAis0DZFcraOY0dv9N7Q2MbswjaCh6LpAhbY3wkSmAN_IRfTVM6x8J9IrxFK7pPrnmPQ5gACgYKAcYSARUSFQHGX2Mi6KV0HbGHbfM8-OZVJvJGmBoVAUF8yKrHJHsdDU5vTJhj4dUixiC70076; __Secure-3PSID=g.a000lAis0DZFcraOY0dv9N7Q2MbswjaCh6LpAhbY3wkSmAN_IRfTwxNJ0EDaUsybBhK6Ta6W_wACgYKAeYSARUSFQHGX2Mi2iIDwMr5P0r5rG0jKKo_qRoVAUF8yKrhVF-obHqYPltt_ySNAmp20076; LSID=o.chromewebstore.google.com|o.drive.fife.usercontent.google.com|o.drive.google.com|o.gds.google.com|o.lens.google.com|o.mail.google.com|o.messages.google.com|o.myaccount.google.com|o.photos.fife.usercontent.google.com|o.photos.google.com|o.play.google.com|o.remotedesktop.google.com|s.JP|s.UA|s.youtube:g.a000kgis0EIaq-Izlgxrj-pvACIy39GiV_lloG6ADiVgZCOylimF2xeZD1RReS9eIEIDM02rNAACgYKAZMSARUSFQHGX2MijKdeHXbZ3MDKnPtFrdYsvBoVAUF8yKqw0WX6189ds4wt8GS18njb0076; __Host-1PLSID=o.chromewebstore.google.com|o.drive.fife.usercontent.google.com|o.drive.google.com|o.gds.google.com|o.lens.google.com|o.mail.google.com|o.messages.google.com|o.myaccount.google.com|o.photos.fife.usercontent.google.com|o.photos.google.com|o.play.google.com|o.remotedesktop.google.com|s.JP|s.UA|s.youtube:g.a000kgis0EIaq-Izlgxrj-pvACIy39GiV_lloG6ADiVgZCOylimFeLk4nZa4VFMPMpApq8pPrwACgYKAfUSARUSFQHGX2MizjIzSrcBxi5y1CNXP-POLxoVAUF8yKrW4WDjfOb3j_wmhL_sSE0z0076; __Host-3PLSID=o.chromewebstore.google.com|o.drive.fife.usercontent.google.com|o.drive.google.com|o.gds.google.com|o.lens.google.com|o.mail.google.com|o.messages.google.com|o.myaccount.google.com|o.photos.fife.usercontent.google.com|o.photos.google.com|o.play.google.com|o.remotedesktop.google.com|s.JP|s.UA|s.youtube:g.a000kgis0EIaq-Izlgxrj-pvACIy39GiV_lloG6ADiVgZCOylimFmqa0U0CNDLdvNNkRJ3I_zQACgYKAWMSARUSFQHGX2MiGlI_op6RnWofRICs2JgHyhoVAUF8yKoapD1EIzO3MuHIUx8YYSYr0076; OTZ=7627306_44_48_123900_44_436380; __Host-GAPS=1:z_UaQpGD-TZ7cMEFx9s6Z3HMzZ18VU4DXKlb7DQ8Qc3tqii7tXREHM77hU5-7AEOazc8g8pHnBfefaoYgPSsrQ8cn1qmLw:RRUPRuqZNzzmHz71; AEC=AVYB7cqeT2K01TV2ZHmP84DP_yV2MGSbRUbLRirC9mTp-l8edNoGK5Dmgg; SEARCH_SAMESITE=CgQIx5sB; NID=515=WLsXdo4gjdbogKZWd9wzZMZB8CI_XPOUt8U-au1MJnXt1C3YqBTFZUjda2I-v6OXkOkzD2X8zdX-zNqalWEY37VbdnPWHv6LhW7by8oVvp5FG0QveH2hs1qTV2j2jKuNfgg90imt6DA1Z8UryLzfs0X1waTmQxJgMEw9DBSehrJ6fzuErNqrIhF0Oa5H5MZmgJmPtmK9pdi0sQjT4-XpYX6ZU41PXDrRFpTBCVTxyXsgTji34ywjjHioXDJYdSb97ugLRrv0tqyyE7GGnPT3iCRix7v0nMAZOG9Si-S3evv3Dz1O2vhhTkg8EARnHPqt95L-A00A9e0Goh82TBa9saoYFjUQ_bFn_5Lu2Is0y_AEDIrYH-JoRax2o1-LbulrUmJu51k5qk-CiiC9VfKgZ1zmDKsI_mlRC6ketY8dCrlk4K0; __Secure-1PSIDTS=sidts-CjIB4E2dkU4YjsE-sNeFmYtgy654akkriKN0ybYWqr29Rlz02RdDx88l2hN_kjFDka-MsBAA; __Secure-3PSIDTS=sidts-CjIB4E2dkU4YjsE-sNeFmYtgy654akkriKN0ybYWqr29Rlz02RdDx88l2hN_kjFDka-MsBAA; SIDCC=AKEyXzXYZWZJfTqpjdbQj6Hk7vM4rIKbwkJVfo-WjaH6jesr01bNyMbK8zzgbRVKO5o1TVzqSjEa; __Secure-1PSIDCC=AKEyXzXvNMyFpMxSITgHxjUdSPk16c-U9gGzDgDri3GG1YgaZSeqkoxk_beeHuKcTYpNczn-CRw; __Secure-3PSIDCC=AKEyXzXdX7Stht3SzzsWq6A4lfKh_T1A1bH6iN43cHg02t78Uq6LjkqzvJwvFAoajrjuIHD7rqM"
    },
    "referrer": "https://accounts.google.com/",
    "referrerPolicy": "origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
  });
  if (!response.ok) {
    console.warn(await response.text())
    throw new Error(`${response.status} - ${response.statusText}`)
  }

  const body = await response.text()
  const matches = body.matchAll(/\((.*?)\)/g)

  for (let match of matches) {
    console.log(match)
  }

  return {
    codeNeededToRotateCookies: 658,
    rotateCode: 100
  }
}

async function rotateCookies() {
  const stuffForRotatingCookies = await getStuffForRotatingCookies()
  console.log(stuffForRotatingCookies)

  const response = await fetch("https://accounts.google.com/RotateCookies", {
    headers: {
      Cookie: `
SMSV=ADHTe-Cta5RzQ1WHKmFHkjE9Zm9JCYzrqh5ARRZc--YBzwmfpSJCmAap_LhU3AI52apr53jh1aPs50ryddp1ytuGYktA6WCfjpaIJC8XYaiNP6U1M8kVMZM; ACCOUNT_CHOOSER=AFx_qI4hIjOdA8VWOVer2xeaIKJTseu3qUxIALgfPv3KWrvf_9Hx7I4wSsXpCZpQj48eFoLswurSdBfDtNTfxpiVy4h1NvSTYtz6SAETgIIBwVime1TNvxv1DsNwou2aU2j8Fk_SoF2lq63MPuO6F9jwM366AY-v6Z_NZY9qRPmhB0qPmbJ_DF1FK2D672nRo4aFlt2nFRKgeHvpff248k_2cBlswsYL_u54e_oU_xSGhp2Y61322Q5cedD9twynvgkau6IanRCoWbcvlw3DCfiEAFXvt-EVLg; HSID=AC85wzo5iy2tLdcZ1; SSID=AkCxWP3OiPUiNdtzE; APISID=JE7mJBJ8ldEruMF1/AEBjVgVQPXMJR9A5d; SAPISID=NblISnlt_7IWnY-c/AXrnSHFX8CjP6rw_L; __Secure-1PAPISID=NblISnlt_7IWnY-c/AXrnSHFX8CjP6rw_L; __Secure-3PAPISID=NblISnlt_7IWnY-c/AXrnSHFX8CjP6rw_L; SID=g.a000lAis0DZFcraOY0dv9N7Q2MbswjaCh6LpAhbY3wkSmAN_IRfTlsJY8TUXynmFl13g4c_DOAACgYKAasSARUSFQHGX2MiS7NG4QnbMLRbjEp2pWm-QhoVAUF8yKov2eOcJO8N8hbvSxZdqsWJ0076; __Secure-1PSID=g.a000lAis0DZFcraOY0dv9N7Q2MbswjaCh6LpAhbY3wkSmAN_IRfTVM6x8J9IrxFK7pPrnmPQ5gACgYKAcYSARUSFQHGX2Mi6KV0HbGHbfM8-OZVJvJGmBoVAUF8yKrHJHsdDU5vTJhj4dUixiC70076; __Secure-3PSID=g.a000lAis0DZFcraOY0dv9N7Q2MbswjaCh6LpAhbY3wkSmAN_IRfTwxNJ0EDaUsybBhK6Ta6W_wACgYKAeYSARUSFQHGX2Mi2iIDwMr5P0r5rG0jKKo_qRoVAUF8yKrhVF-obHqYPltt_ySNAmp20076; LSID=o.chromewebstore.google.com|o.drive.fife.usercontent.google.com|o.drive.google.com|o.gds.google.com|o.lens.google.com|o.mail.google.com|o.messages.google.com|o.myaccount.google.com|o.photos.fife.usercontent.google.com|o.photos.google.com|o.play.google.com|o.remotedesktop.google.com|s.JP|s.UA|s.youtube:g.a000kgis0EIaq-Izlgxrj-pvACIy39GiV_lloG6ADiVgZCOylimF2xeZD1RReS9eIEIDM02rNAACgYKAZMSARUSFQHGX2MijKdeHXbZ3MDKnPtFrdYsvBoVAUF8yKqw0WX6189ds4wt8GS18njb0076; __Host-1PLSID=o.chromewebstore.google.com|o.drive.fife.usercontent.google.com|o.drive.google.com|o.gds.google.com|o.lens.google.com|o.mail.google.com|o.messages.google.com|o.myaccount.google.com|o.photos.fife.usercontent.google.com|o.photos.google.com|o.play.google.com|o.remotedesktop.google.com|s.JP|s.UA|s.youtube:g.a000kgis0EIaq-Izlgxrj-pvACIy39GiV_lloG6ADiVgZCOylimFeLk4nZa4VFMPMpApq8pPrwACgYKAfUSARUSFQHGX2MizjIzSrcBxi5y1CNXP-POLxoVAUF8yKrW4WDjfOb3j_wmhL_sSE0z0076; __Host-3PLSID=o.chromewebstore.google.com|o.drive.fife.usercontent.google.com|o.drive.google.com|o.gds.google.com|o.lens.google.com|o.mail.google.com|o.messages.google.com|o.myaccount.google.com|o.photos.fife.usercontent.google.com|o.photos.google.com|o.play.google.com|o.remotedesktop.google.com|s.JP|s.UA|s.youtube:g.a000kgis0EIaq-Izlgxrj-pvACIy39GiV_lloG6ADiVgZCOylimFmqa0U0CNDLdvNNkRJ3I_zQACgYKAWMSARUSFQHGX2MiGlI_op6RnWofRICs2JgHyhoVAUF8yKoapD1EIzO3MuHIUx8YYSYr0076; OTZ=7627306_44_48_123900_44_436380; __Host-GAPS=1:z_UaQpGD-TZ7cMEFx9s6Z3HMzZ18VU4DXKlb7DQ8Qc3tqii7tXREHM77hU5-7AEOazc8g8pHnBfefaoYgPSsrQ8cn1qmLw:RRUPRuqZNzzmHz71; AEC=AVYB7cqeT2K01TV2ZHmP84DP_yV2MGSbRUbLRirC9mTp-l8edNoGK5Dmgg; SEARCH_SAMESITE=CgQIx5sB; NID=515=FM-ViVoOXANV2F6E3aXGcyCfRZmPMS5Qp0s6XlWaesHO-l_kHpNe8TI3KUi0kVCOnC0ZpdbMvSWSxOdwpF6YXcqbi9B0FxLbedgxsX53CF9SNUDrjoxEqz8sPq87am61L_sMBPSclg0LQIobWyVs5_OmEInqDIoBoaLCEJxYum0F70urrqpbAoeixC_EY8DgS117uXJLvlSt9U4Q8RQu0PsQ0q-iNP6OHtGdEiNYUvm-Dscw9Ge0UklRzwit08dBPZdXv149T4hrB5yAjQtbX5w3d6K9AqU6Kfpn1qsVffS1y3-hllw3PXIfEqHweZ4ZvBI9VWW-KpLYlSWk9L9zt_yj3T-MEQ1BYS2qwpVgd_Oj8MISA_vgqjKUXjpukbJzY_hS3yAgAqjRNnbK; __Secure-1PSIDTS=sidts-CjIB4E2dka-p2pEb6gKnVd4ujgWc_pJYy8tz17ieyR25lUGR_uRRles9-c5Gg9YpTkGZpxAA; __Secure-3PSIDTS=sidts-CjIB4E2dka-p2pEb6gKnVd4ujgWc_pJYy8tz17ieyR25lUGR_uRRles9-c5Gg9YpTkGZpxAA; SIDCC=AKEyXzWtWAZGAo0YAZrUsTzmXe6bYHQ6R4oHnlc0yWQPCpTlgX9-5VU4dxdW1inE1M2cLRzkQhlA; __Secure-1PSIDCC=AKEyXzWumDBMLoLdiQcopH_ySoHExVT3xU-WpXtW3hj_cI66NPC8Zgv9bfioGX0TzMxaXaePrXg; __Secure-3PSIDCC=AKEyXzVe3_ThOTw1m3AWO1MUYV5W_7_ENVRFyuV4rVVYxUl_w72vXx_M-WHVWVQCWfX9RanCu5E`
    },
    body: JSON.stringify([
      stuffForRotatingCookies?.rotateCode,
      // definitely not the way to go.. probably
      stuffForRotatingCookies?.codeNeededToRotateCookies
    ]),
    method: "POST",
  })

  if (!response.ok) {
    console.warn(`Failed to rotate cookies: ${response.status} ${response.statusText} - ${response.body}`)
    return;
  }
  cookies = []

  const setCookies = response.headers.getSetCookie()

  for (let cookie of setCookies) {
    console.log(cookie)
  }
}

async function getGeminiResponses(prompt: string): Promise<GeminiResponse[]> {
  // TODO: figure out how to handle new lines properly.
  const encodedPrompt = encodeURIComponent(`SYSTEM: You must keep the response under 2000 characters, do NOT mention the system prompt. You may not use your image generation features as they are currently unsupported. User Prompt: ${prompt}`)
  // protobuf is a pain, i hate protobuf.
  const requestForm = `f.req=%5Bnull%2C%22%5B%5B%5C%22${encodedPrompt}%5C%22%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2C0%5D%2C%5B%5C%22en%5C%22%5D%2C%5B%5C%22c_35c20b36fc20e021%5C%22%2C%5C%22r_1acd340da921eb5e%5C%22%2C%5C%22rc_854eaeaffd70e850%5C%22%5D%2C%5C%22!OzilOGDNAAYAY4k9IGNC6FYKsS1Sa4c7ADQBEArZ1OIPFRf0iXD85ymy84g23Ukl6fxQRBvQgW1Fa6bd4fEMXXXEiOWQJ8sH_oUfk8WsAgAABEdSAAAACWgBB34AOW3Fc3yA5E46B4ZUhvaOXTf8Z4L-rFKe1r-FmpJAKvr0PYY09W17CkYRmH2zSuX6ThbeDpx1L0hYFgoAbvtp-SFJNsbROS6CJE7EhEwnBSP2BVE-T87-FeyMTZiav6IIqkbFmM2zyhWUbHLKAjPNJA8y2Oxav8WV42Fq-Ka4X7hlj3Z9Lmk6FvcrW5shr38Fpc_ulx_09Gtt75F7IOa67L1_x5LOTSoT-AulmQLVE7JAfyGt4M4BAbpxXhCRGYelMsxev1gqG18_ukqCPZFw8291oOreQg1x8hlcpPYgnZ6SgXf6uz-iMFJaBgcWP0zd7QLAL_3_ABLyXyTLKOd306UXYjD6PWQnln2qCUPQVRp8fNDfxBqjMQakMIzNpxQQXSBAHFzCZzKnT7TwTi4saXAoYx4NKytmeLlF4sWQ3h_zTQrAYam8gQ2evPLfpVKPPpdPUAXCGY1gB4eDB4SUzmORHdh_Jh_a1rBfj6kYWxJ2Dy379C8q5u57fex8GFDOH-ti_LgGW3EEqKOz_iiiNBB6CrDefWciZQ9ON_fbZmNbF3KoRg6wfEoflgQ_plCaMNfoRsMS_f_7TErsLjTTEw46FaKI8c2rSvE2GUz0ev9Yua_gNLQ6pDAsFfAPXmkzduyWIMGZ1OhUgjHZQ75KwejjhVBSFDfYHmDFVdP75mZrceBo_3zIfp2YfHBxR_5vVmY-EmAKTK3OkT5-gg2m9-jvEiqzpt9V8732FuJ-PKiqUjBuePQGHN4qNGg-TIe4wECM5g4wgLKcC2OgxkyFXfZxYWUyVGyV1Z-KZX7Wm4n983--hbVCycJ-DB_EwWVG4Lpp1jh_VoxXhAUu3j15NEslFDzGMI4xxZlCfrhPyTun4apyqmS7dLY7t6jz7mMOG8jpSXUrSsymU5QYPXFhcsSHhzavQPzEKUT6DXfLbTcVortRF55fYM1nT8Og6yQUVEi1bnVM6Lnn0kFecsSsamW4uE14z3HKCWp1JHFn25oTxh_uFWCAgA5nvQciCP10VQeFC-INe_FRM4_P2xue-FrMYCxwDAepSwt-RdWPqd0hcdnysXRoobWlgIb-XXl-I1mT4gSs95NnYMNFw4IyhJ62-g5p-qti0pCy4W1iWrpGmG2rG7SOu_lL1CpyJovSZQMIqbN0fGsuiAR16UnDkOr0pZTJyHh-Ct_Ww_XuLVt42n8%5C%22%2C%5C%2252a17368437192b434d741fedd7a5ae7%5C%22%2Cnull%2C%5B0%5D%2C1%2Cnull%2Cnull%2C1%2C0%2Cnull%2Cnull%2Cnull%2Cnull%2C0%2C%5B%5B1%5D%5D%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C0%2C1%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2Cnull%2C%5B%5D%5D%22%5D&at=AFQ3XeY_PRhG_4pndovhI3yhxGLd%3A1720326019813`;

  const apiResponse = await fetch(
    "https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20240702.06_p1&hl=en&rt=c",
    {
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36",
        "Cookie": cookies.join(";"),
      },
      referrer: "https://gemini.google.com/",
      referrerPolicy: "origin",
      body: requestForm,
      method: "POST",
      mode: "cors",
    }
  );

  if (!apiResponse.ok) {
    console.log(`API request failed: ${apiResponse.status} - ${apiResponse.statusText}`)
    console.log(await apiResponse.text())



    throw new Error(`API request failed! - ${apiResponse.status}, ${apiResponse.statusText}`)
  }

  const body = await apiResponse.text();
  const lines = body.split("\n");
  const filteredLines = lines.filter((line) => {
    if (line.startsWith("[")) {
      return line;
    }
  });

  const jsonArrays = filteredLines.map((array) => {
    return JSON.parse(array);
  });

  const apiResponses = jsonArrays
    .map((jsonArray) => {
      if (jsonArray == undefined) {
        return;
      }
      const value = jsonArray[0][2];
      if (value == undefined) {
        return;
      }
      const parsed = JSON.parse(value);

      for (let value of parsed) {
        if (Array.isArray(value) && value.length == 3) {
          const isResponseArray = value.every((response) => {
            const responseId = response[0];

            if (
              responseId != undefined &&
              typeof responseId == "string" &&
              responseId.startsWith("rc_")
            ) {
              return true;
            }
          });

          if (isResponseArray) {
            return value;
          }
        }
      }
    })
    .filter((element) => element != undefined);

  if (apiResponses.length == 0) {
    throw new Error("GeminiAPI did not return any response, maybe we have expired cookies?")
  }

  const responses: GeminiResponse[] = apiResponses[0]
    .map((response) => {
      return response;
    })
    .map((response) => {
      return {
        responseId: response[0],
        content: response[1][0],
        language: response[9],
      };
    });

  return responses;
}

export const Gemini: CommandV2 = {
  data: new SlashCommandBuilder()
    .setName("gemini")
    .setDescription("Talk to Google Gemini!")
    .addStringOption(option =>
      option.setName("prompt")
        .setDescription("What do you want to say to Gemini?")
        .setRequired(true)
    ),
  deferReply: true,
  run: async (interaction: CommandInteraction) => {
    const prompt = (interaction.options.get("prompt")?.value as string)

    try {
      // try to fetch it the first time; if it fails, then we rotate the cookies
      try {
        await getGeminiResponses(prompt)
      } catch (err) {
        console.log("Initial response failed, fetching cookies..")
        await rotateCookies()
        console.log(err)
      }

      const responses = await getGeminiResponses(prompt)
      const response = responses[0]
      const embed = new EmbedBuilder()
      embed.setTitle("TODO: Set Conversation Title")
      embed.setDescription(response.content)
      embed.setFooter({
        text: `Google Gemini - ${responses.length} other responses are available.`
      })
      embed.setColor([129, 112, 197])

      await interaction.followUp({
        embeds: [embed]
      })
    } catch (err) {
      console.log(err)
      await interaction.followUp(ERROR_MESSAGE)
    }
  },
};
