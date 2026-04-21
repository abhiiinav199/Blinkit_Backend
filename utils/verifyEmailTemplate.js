export const verifyEmailTemplate = ({ name, url }) => {
    return `
        <p>Dear  ${name}</p>
        <p>Thank you for registering Blinkeyit</p>
        <a href=${url} style="color:black; background:orange; padding:20px; margin-top:10px; text-decoration:none; display:block;"> Verify Email </a>
    `

}