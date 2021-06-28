import Document, { Html, Head, Main, NextScript } from 'next/document'

class CustomDocument extends Document {

    render() {
        return (
            <Html lang="en">
                <Head />
                <body className="bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-white">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default CustomDocument