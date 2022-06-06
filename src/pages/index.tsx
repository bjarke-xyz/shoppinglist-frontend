import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Link,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <Box bgImage="/charlie-brown.svg">
      <Container>
        <Flex flexDir="column" height="100vh">
          <Box
            bgColor="white"
            padding="4"
            mt="4"
            boxShadow="md"
            borderRadius="md"
          >
            <Flex flexDir="column" justify="center" align="center">
              <Heading mr="4">Simple Shopping List</Heading>
              <Flex justify="right" width="100%">
                <NextLink href="/app" passHref>
                  <Link>
                    Go to app <ExternalLinkIcon mx="2px" />
                  </Link>
                </NextLink>
              </Flex>
            </Flex>
            <p>
              Simple shopping list application, accessible on web and mobile
            </p>
            <Wrap mt="4" justify="center">
              <WrapItem>
                <Image
                  alt="Screenshot of application on mobile device"
                  maxHeight="300px"
                  src="/screenshot.png"
                ></Image>
              </WrapItem>
              <WrapItem>
                <Image
                  alt="Screenshot of application"
                  maxHeight="300px"
                  src="/screenshot_landscape.png"
                ></Image>
              </WrapItem>
            </Wrap>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Home;
