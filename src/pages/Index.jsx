import React, { useEffect, useState } from 'react';
import { Container, Text, VStack, Box, Image, SimpleGrid, Spinner, Heading } from "@chakra-ui/react";
import axios from 'axios';
import * as cheerio from 'cheerio';

const Index = () => {
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroceries = async () => {
      try {
        const response = await axios.get('https://www.rbpatel.com/shop/page/1');
        const html = response.data;
        const $ = cheerio.load(html);
        const items = [];

        $('.product').each((index, element) => {
          const title = $(element).find('.woocommerce-loop-product__title').text();
          const price = $(element).find('.price').text();
          const image = $(element).find('img').attr('src');
          items.push({ title, price, image });
        });

        setGroceries(items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching grocery data:', error);
        setLoading(false);
      }
    };

    fetchGroceries();
  }, []);

  return (
    <Container centerContent maxW="container.xl" py={10}>
      <VStack spacing={4}>
        <Heading fontSize="4xl" fontWeight="bold">Grocery Items</Heading>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <SimpleGrid columns={[1, 2, 3]} spacing={10}>
            {groceries.map((item, index) => (
              <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} boxShadow="md">
                <Image src={item.image} alt={item.title} boxSize="200px" objectFit="cover" mx="auto" />
                <Text mt={2} fontSize="xl" fontWeight="semibold">{item.title}</Text>
                <Text mt={2} color="green.500" fontSize="lg">{item.price}</Text>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default Index;