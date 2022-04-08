# NextJSを使ってWordPressの投稿を表示する
### なぜやるか
親しんだCMSを利用して、NextJSとヘッドレスCMSを使ったJamStackの体験をします。また、APIを利用した静的サイト構築も同時に体験します。
JamStackとは
    ・JavaSctript
    ・API マークアップ
    ・（HTML）
を組み合わせた技術構成のことを言います。

### やること
* NextJSの特徴
* ヘッドレスCMSとは
* WordPressの設定
* NextJSのコード解説
* Vercelでのデプロイ
 
### やらないこと
* NextJSの詳細説明  NextJSの細かい仕様や独自の関数などは省きます。
* WordPressの説明

## NextJSとは
ホスティングサービスを提供するVercelという企業が開発したReactをベースのフロントエンドフレームワークです。

### SSGとSSR
大きな特徴として、デプロイ時にあらかじめ静的なページを作成することで、クライアント側に負担をかけずに、レスポンスの向上されます。また、サーバーサイドレンダリングにも対応していて、自動で切り替えてデプロイしてくれます。
デプロイ時に外部APIからデータをもらい、サイトを構築することが出来るので、ブログやコーポレートサイトなど記事投稿があるwebサイトの構築に向いています。

### SEO的に有利
静的なページが既にある状態なので、検索エンジンが理解しやすく、SEO的に有利になると言われています。

### レスポンスがよい
静的サイトを表示するだけなので、WPよりも高速に表示されます。さらに動的な部分があった場合、その部分だけリロードすることで高速に表示を変更することも出来ます。
そのほか、レスポンス向上のための機能が盛り込まれています。

### APIサーバーにもなる
エンドポイントを設定することで、バックエンドなしでもAPIでの遣り取りが出来ます。

Reactとの違いは大まかにいうとこの辺りになります。NextJSはとにかく静的サイトを作ることを主眼においたサイトの高速化を目指していて、
コーポレートサイトやブログなどのあまり更新頻度の高くないサイトに向いています。


## ヘッドレスCMSとは
コンテンツの管理と表示がセットになっているのが一般的なCMSでWPなど有名ですが、コンテンツ管理のみを行うシステムがヘッドレスCMSです。

普通のCMSは、管理画面やデータベースと表示するサイトが1対1の関係になっていて、表示サイトが複数になれば、その分、管理画面も増えていきます。
管理画面が増えると、コンテンツの更新の量も時間も増えてしまい、管理コストがかかってしまいます。

ヘッドレスCMSでは、管理画面やデータベースだけのCMSで、表示サイトにはAPIをもってデータの提供をします。表示サイト側は必要なデータだけをヘッドレスCMSに要求し、
ユーザーに合わせたアプローチが出来ます。
管理画面が一つなので、データの更新が1回だけで完了し、複数のサイトに同じデータが提供されます。

https://www.newt.so/docs/headless-cms
[ヘッドレスCMS](https://images.blog.microcms.io/assets/f5d83e38f9374219900ef1b0cc4d85cd/400b0df2bec24bbd97510e80ec1e2bd1/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202021-04-30%2015.27.01.png)

### データのやりとり
ヘッドレスCMSはAPIを使ってデータのやり取りを行います。そのため、1つのヘッドレスCMSで複数のサイトや、それ以外のコンテンツも管理することが出来ます。
CMSから表示サイトにデータを流すだけでなく、APIを使ってCMSへデータの送信も可能です。

### 管理画面の自由度と簡略化
APIの入出力によって管理画面のフォームを自由に設定することが出来るので、最適化されたフォームにすることで、初心者でもコンテンツ管理が簡単になります。
ワードプレスでは、テーマやプラグインなど投稿者が操作しない項目がたくさんあり、構築側からすると触れてほしくない項目がたくさんあって不安になりますね。

### フロントエンドの自由度が高い
一般的なCMSは独自のフォーマットに沿ったサイト構築になりますが、ヘッドレスCMSでは、引っ張ってきたデータをもとに自由にサイトを構築することが出来ます。
中身のデータ以外は普通のウェブサイトのようにデザインすることが出来ます。

### 攻撃されにくい
表示側と管理側が分離しているので、管理側のシステムにアクセスされづらい
ワードプレスでは、/wp-admin　というディレクトリが分かってしまっているので、IDとパスワードさえ判れば、攻撃し放題になります。さらに脆弱性があった場合にも大変なことになります。
その点、ヘッドレスCMSでは、表示側から管理サイトが分からない構成にすることが出来るので、比較的安全に運用することが出来ます。


## WordPressの設定
### プラグインをインストール
* WP GraphQL
WPのデータベースをGraphQLで操作できるプラグインをインストールします。

* WP Webhooks
投稿など特定の操作をした際に、デプロイするための通知をするプラグインをインストールします。

### slugを変更
slugとはWPで投稿したURLの文字列になります。
投稿のタイトルが日本語だとslugも日本語になってしまうので、function.phpにslugを変更する関数を追加します。
```
/*
* スラッグ名が日本語だったら自動的に投稿タイプ＋id付与へ変更（スラッグを設定した場合は適用しない）
*/
function auto_post_slug( $slug, $post_ID, $post_status, $post_type ) {
    if ( preg_match( '/(%[0-9a-f]{2})+/', $slug ) ) {
        $slug = utf8_uri_encode( $post_type ) . '-' . $post_ID;
    }
    return $slug;
}
add_filter( 'wp_unique_post_slug', 'auto_post_slug', 10, 4  );
```
### 前の投稿と次の投稿
WP GlaphQLの初期状態だと「前の投稿」や「次の投稿」への情報が取得できないため、下記のコードをfunction.phpに追加します。
他にも色々な機能を利用できるようになります。
[gql-functions.php ](   )

### WordPressをCMSにする理由
あくまでもWPの投稿データを流用する場合や、WPの操作に慣れている投稿者に対してのアプローチになります。また、格安で始められるので個人レベルなら採用理由の一つになりますが、なんだかんだでWPの知識は必要になりますので、知識の幅を結構必要とします。管理画面までカスタマイズできるレベルならオススメの一つになります。
新規のプロジェクトで立ち上げるなら、ちゃんとしたヘッドレスCMSサーバーを利用したほうが投稿者側のUI/UXは向上します。


## NextJSのコード解説
### ページルーティング
NextJsはpagesディレクトリにあるファイルをもとにWEBサイトの各ページを事前レンダリングを行います。
1ファイル1ページの構成になります。
このPostsの部分は、【id】.jsというファイル名にすることで、自動的にファイルを生成してくれる、動的ルーティングになります。
/pages
 ┣index.js  (http:aaa.com/)
 ┣about.js  (http:aaa.com/about)
 ┗posts/
    ┣post-1 (http:aaa.com/posts/post-1)
    ┗post-2 (http:aaa.com/posts/post-2)

### 動的ルーティング
ページファイルの名前を
[id].js
と命名すると、外部データから引っ張ってきたファイル名でページを生成することが出来ます。
`getStaticPaths:[{params:{id:string}}]=async()=>...`
この関数を[id].jsの中に記述すると、まずgetStaticPathsを実行し、その結果をファイル名に反映します。

### SSGとSSR
Nextの特徴といえる事前の静的サイト生成（SSG）と、サーバーサイドレンダリング（SSR）を行うにあたって、外部データを使う場合には、下記の関数を記述します。
* SSGの場合
`getStaticProps : {props:}= async (context) => `
* SSRの場合
`getServerSideProps : {props:}= async (context) => `

これらの関数の戻り値がページコンポーネントのpropsに充てられます。
動的ルーティングを使用する場合には、先に同じファイル上にある`getStaticPaths`を実行した後、その戻り値がcontextに充てられます。

### API
pagesディレクトリ内のapiディレクトリにあるファイルがAPIのエンドポイントになります。
`/pages/api/hello.js (/api/hello)`

`export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ name: 'John Doe' })
}`
あくまでもおまけ程度なので、フロントとバックを繋ぐ程度のAPIが良いらしいです。

## Vercelにデプロイ

### Vercelとは
NextJSを開発しているホスティング会社で、Git等と連動して自動でデプロイまでしてくれるホスティングサービスを提供しています。
開発会社なので、NextJSを使う場合には、ほぼVercel一択になります。

### New Project
Vercelのアカウントを取得した後は、New Projectから、Github上のリポジトリを選択することで、デプロイが完了します。

### 環境変数の設定
Setting -> Environment Variables

### デプロイHooksを発行
Settings -> Git -> Deploy Hooks -> Create Hooks
Hooks名とリポジトリブランチを選択


## マイクロCMS
国産のヘッドレスCMSを提供しているのがマイクロCMS




This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
