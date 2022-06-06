import { Button, Container } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <Container>
      <div>
        <p>Wow! Landing page!</p>
        <Button color={"green.400"}>hej</Button>
        <Link href={"/app"}>App</Link>
      </div>
    </Container>
  );
};

export default Home;
