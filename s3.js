const dotenv = require("dotenv")
const aws = require("aws-sdk")
const crypto = require("crypto")
const { promisify } = require("util")

const randomBytes = promisify(crypto.randomBytes)

dotenv.config()

const region = process.env.AWS_BUCKET_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Params = {
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
}


const s3 = new aws.S3(s3Params)

async function generateUploadURL() {
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  })

  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}
exports.generateUploadURL = generateUploadURL


function return1(){
  return 1
}
exports.return1 = return1