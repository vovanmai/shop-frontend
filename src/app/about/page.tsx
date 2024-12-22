'use client'
import {Metadata} from "next";
import { Button } from 'antd';
import Link from "next/link";



// export const metadata: Metadata = {
//   title: "About page",
//   description: "about",
// };


export default function About() {
  const handleSetCookie = async () => {
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data.message);
    console.log(123)
  };
  return (
    <div>
      <Button type="primary" onClick={() => {handleSetCookie()}}>Primary Button</Button>
      <p>About Page</p>
      <Link href="/">Go to Home</Link>
    </div>
  );
}
