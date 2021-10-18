import Document, {Html, Head, Main, NextScript} from 'next/document'

class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html lang="en">
                <Head/>
                <body className="bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-white">
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument;