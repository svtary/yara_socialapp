
import  {Transporter, createTransport, SendMailOptions, SentMessageInfo} from 'nodemailer'
import credentials from '../config/credentials';

export interface MailSend {
  email: string; // 目的邮箱地址
  vertifyCode: string; // 验证码
  user: string; // 用户名（可不要）
}

export const sendMailVertify = (data: MailSend) => {
  console.log('lassssss', credentials.qq.pass, credentials.qq.user)
  const {email, vertifyCode, user} = data
  const transporter:Transporter  = createTransport({
    host:"smtp.163.com",
    port:465,
    secure:true,
    auth: {
      user: credentials.qq.user,
      pass: credentials.qq.pass
    },
    tls: { rejectUnauthorized: false},
    debug: true, // show debug output
    logger: true // log information in console

  })

    const options: SendMailOptions = {
    from: credentials.qq.user, 
    to: email,
    subject: '06K4Studio', // 邮件标题
    html: `<h2>${user}您好</2>,<p>您的邮箱验证码为${vertifyCode}，五分钟有效</p>` //邮件模板
  }

  return transporter.sendMail(options).then((info: SentMessageInfo) => info)
}





