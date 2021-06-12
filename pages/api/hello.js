import os from "os"
import { promises as fsp } from "fs"
import path from "path"

import { Firestore, FieldValue } from "@google-cloud/firestore"

let firestore = null

export default async (req, res) => {
  if (!firestore) {
    const baseDir = await fsp.mkdtemp((await fsp.realpath(os.tmpdir())) + path.sep)
    const fileName = path.join(baseDir, "credentials.json")
    const buffer = Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64")
    await fsp.writeFile(fileName, buffer)

    process.env["GOOGLE_APPLICATION_CREDENTIALS"] = fileName

    firestore = new Firestore()
  }

  const increment = FieldValue.increment(1)

  await firestore.doc("v1/default").update({ counter: increment })

  res.status(200).json({})
};
