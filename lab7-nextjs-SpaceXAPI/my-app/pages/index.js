import Link from 'next/link';
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>SpaceX SSG</title>
      </Head>
      <h2>The purpose of this website is to view information from the SpaceX API in a neat way!</h2>
      <br />
      <p>SpaceX designs, manufactures and launches advanced rockets and spacecraft. The company was founded in 2002 to revolutionize space technology, with the ultimate goal of enabling people to live on other planets.</p>
      <br />
      <Link href='/launches/page/1'>Launches</Link>
      <br />
      <Link href='/payloads/page/1'>Payloads</Link>
      <br />
      <Link href='/cores/page/1'>Cores</Link>
      <br />
      <Link href='/rockets/page/1'>Rockets</Link>
      <br />
      <Link href='/ships/page/1'>Ships</Link>
      <br />
      <Link href='/launchpads/page/1'>Launchpads</Link>
  </div>
  );
}
