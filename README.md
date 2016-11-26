# app.pittankopta.net

## 目的
app.pittankopta.netのコーディング環境を  
jadeとstylusで行いたかったので環境を整えてみました。  
gulpを使ってローカルでビルドを行って、そのままSFTPでアップできる  
スクリプトもあります。

## できること
* jadeからHTMLの生成  
* stylからcssの生成
* jsをuglifyする
* ビルドしたものをSFTPでアップする

## 必要なもの
* 適当なnode環境
* 適当なnpm環境
* デプロイ先のサーバ（任意）  

## ディレクトリ構成について
`src/`直下にもりもり書いていけばたぶんビルドでごっそり`dist/`以下に  
もっていけるはずです。持っていけないようなら直しましょう。

## SFTPアップロードについて  
`.ftppass` ファイルを作成して、そこに認証情報を  
書き込んでください。中身はシンプルなJSONファイルです。  
ソース管理には含めないように`.gitignore`ファイルに追記してあります。  
以下サンプルです。
```
{
  "app.pittankopta.net" : {
    "user" : "hogehoge",
    "passphrase" : "foobar"
  }
}
```
gulpファイル内での使い方についてはコメントを参照してください。
