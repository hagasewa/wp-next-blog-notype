# NextJSを使ってWordPressの投稿を表示する
### なぜやるか
親しんだCMSを利用して、NextJSを使ったヘッドレスCMSの体験をします。
また、APIを利用した静的サイト構築も同時に体験します。

### やること
* NextJSの特徴
* ヘッドレスCMSとは
* WordPressの設定
* NextJSのコード解説

### やらないこと
* NextJSの詳細説明
* WordPressの説明

## NextJSとは
ホスティングサービスを提供するVercelという企業が開発したReactをベースのフロントエンドフレームワークです。

### SSGとSSR
大きな特徴として、デプロイ時にあらかじめ静的なページを作成することで、クライアント側に負担をかけずに、レスポンスの向上されます。また、サーバーサイドレンダリングにも対応していて、自動で切り替えてデプロイしてくれます。
デプロイ時に外部APIからデータをもらい、サイトを構築することが出来るので、ブログやコーポレートサイトなど記事投稿があるwebサイトの構築に向いています。

### サイトの構造化が簡単
pageディレクトリ内にあるファイルがサイトの1ページとして表示されるので、直観的でわかりやすくサイト構成を作ることが出来ます。
ブログ投稿のようにパーマリンクとして設定することも出来ます。

### レスポンスがよい
静的サイトを表示するだけなので、WPよりも高速に表示されます。さらに動的な部分があった場合、その部分だけリロードすることで高速に表示を変更することも出来ます。
そのほか、レスポンス向上のための機能が盛り込まれています。

### APIサーバーにもなる
エンドポイントを設定することで、バックエンドなしでもAPIでの遣り取りが出来ます。


## ヘッドレスCMSとは
コンテンツの管理と表示がセットになっているのが一般的なCMSでWPなど有名ですが、コンテンツ管理のみを行うシステムがヘッドレスCMSです。
[ヘッドレスCMS](https://images.blog.microcms.io/assets/f5d83e38f9374219900ef1b0cc4d85cd/400b0df2bec24bbd97510e80ec1e2bd1/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%202021-04-30%2015.27.01.png)

### データのやりとり
ヘッドレスCMSはAPIを使ってデータのやり取りを行います。そのため、1つのヘッドレスCMSで複数のサイトや、それ以外のコンテンツも管理することが出来ます。

### 管理画面の自由度と簡略化
APIの入出力によって管理画面のフォームを自由に設定することが出来るので、最適化されたフォームにすることで、初心者でもコンテンツ管理が簡単になります。

### フロントエンドの自由度が高い
一般的なCMSは独自のフォーマットに沿ったサイト構築になりますが、ヘッドレスCMSでは、引っ張ってきたデータをもとに自由にサイトを構築することが出来ます。

### 攻撃されにくい
表示側と管理側が分離しているので、管理側のシステムにアクセスされづらい


## WordPressの設定
### WP GraphQL
WPのデータベースをGraphQLで操作できるプラグインをインストールします。

### slugを変更
投稿のタイトルが日本語だとpostのURLを表すslugも日本語になってしまうので、function.phpにslugを変更する関数を追加します。
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
[gql-functions.php ](https://github.com/funkhaus/fuxt-backend/blob/master/functions/gql-functions.php#L32-L146)


## NextJSのコード解説
### ページルーティング
NextJsはpagesディレクトリにあるファイルをもとにWEBサイトの各ページを事前レンダリングを行います。

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

