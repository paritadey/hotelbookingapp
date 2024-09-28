import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch, } from 'react-redux';
import { fetchSearchHotelListRequest } from '../searchHotelList/action';
import { RootState } from '../searchHotelList/store';
import React, { useEffect, useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'
import { CardPhoto, Daum, } from './type';

type Props = {
  geoId: string; checkIn: string; checkOut: string; currencyCode: string; priceMax: string; priceMin: string; rooms: string; adults: string;
  navigation: NativeStackNavigationProp<RootStackParamList, 'SearchHotel'>;
};

const randomImage: string[] = [
  'https://i.pinimg.com/564x/22/17/2a/22172a778498fdd0b4894ccf93fd1ca3.jpg',
  'https://i.pinimg.com/564x/bf/63/cd/bf63cdbbff45daac5bc856f923ed5e7d.jpg',
  'https://i.pinimg.com/564x/2a/9d/e5/2a9de531bcbb01c20177706cfdfc8fb1.jpg',
  'https://i.pinimg.com/564x/08/cd/32/08cd32c6be713985778b1f7e51858fa9.jpg',
  'https://i.pinimg.com/736x/46/94/b4/4694b450807f3384e300e6f18af74208.jpg',
  'https://i.pinimg.com/564x/46/f5/0c/46f50c0ab495f9d433a22c33a0137e23.jpg',
  'https://i.pinimg.com/564x/3f/7e/42/3f7e42164189ed6f79a9f934e7c05c6b.jpg',
  'https://i.pinimg.com/736x/25/56/e1/2556e174c5cace5f0384044fdaf3f717.jpg',
  'https://i.pinimg.com/564x/58/36/84/583684b97f8211eca1e7581d4dfd8f04.jpg',
  'https://i.pinimg.com/736x/9f/d0/56/9fd0567e19f1e06aa4f1acc08a476fda.jpg',
  'https://i.pinimg.com/564x/90/27/1f/90271fd5056f8e09403c8ff918da3925.jpg',
  'https://i.pinimg.com/736x/c5/92/7f/c5927f32a3082c972b8462547bff4ee5.jpg',
  'https://i.pinimg.com/564x/08/cd/32/08cd32c6be713985778b1f7e51858fa9.jpg',
  'https://i.pinimg.com/564x/08/cd/32/08cd32c6be713985778b1f7e51858fa9.jpg',
  'https://i.pinimg.com/736x/c5/92/7f/c5927f32a3082c972b8462547bff4ee5.jpg',
  'https://i.pinimg.com/564x/08/cd/32/08cd32c6be713985778b1f7e51858fa9.jpg',
  'https://i.pinimg.com/564x/08/cd/32/08cd32c6be713985778b1f7e51858fa9.jpg',
  'https://i.pinimg.com/564x/08/cd/32/08cd32c6be713985778b1f7e51858fa9.jpg',

];
const SearchList: React.FC<Props> = ({ geoId, checkIn, checkOut, currencyCode, adults, rooms, priceMax, priceMin, navigation }) => {
  const allPhotos: CardPhoto[] = [];
  console.log("Data we found from SearchData to SearchList:", geoId, checkIn, checkOut, currencyCode, adults, priceMax, priceMin, rooms);
  const dispatchSearchHotels = useDispatch();
  const searchData = useSelector((state: RootState) => state.hotelList);
  const loading = useSelector((state: RootState) => state.loading);
  // const error = useSelector((state: RootState) => state.error);

  useEffect(() => {
    dispatchSearchHotels(fetchSearchHotelListRequest(geoId.toString(),
      checkIn.toString(), checkOut.toString(), currencyCode.toString(), priceMin.toString(),
      priceMax.toString(), rooms.toString(), adults.toString()));
  }, [dispatchSearchHotels]);

  // console.log("Searched Data fetched in SearchList:", searchData?.data);
  const results = searchData?.data.data;
  const sort = searchData?.data.sortDisclaimer;
  //  console.log("Sort: ", sort);
  //console.log("First Phase:", results);
  console.log("size of the result:", results?.length);

  //   searchData?.data?.data.forEach((hotel) => {
  //         hotel.cardPhotos.forEach((photo, index) => {
  //         const cardPhoto: CardPhoto = {
  //             sizes: {
  //               maxHeight: photo.sizes.maxHeight,  // Extract properties from photo.sizes
  //               maxWidth: photo.sizes.maxWidth,
  //               urlTemplate: photo.sizes.urlTemplate,
  //             }
  //           };    
  //         allPhotos.push(cardPhoto);
  //     });
  //   });
  //   console.log("Card photos: ",  allPhotos.length);

  const displayData: Daum[] = searchData?.data.data?.map((item): Daum => {
    return {
      //cardPhotos: item.cardPhotos,
      bubbleRating: item.bubbleRating,
      id: item.id,
      priceDetails: item.priceDetails,
      title: item.title,
      secondaryInfo: item.secondaryInfo,
      priceForDisplay: item.priceForDisplay,
      primaryInfo: item.primaryInfo,
      priceSummary: item.priceSummary,
      strikethroughPrice: item.strikethroughPrice,
    };
  }) || [];

  console.log("Display data: ", displayData.length,);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * randomImage.length);
    return randomImage[randomIndex]; // Return a random image URL
  };

  const goToHotelDetailScreen = (hotelId: string, checkIn: string, checkOut: string, rooms: string, adults: string, currencyCode: string, priceDetails: string, priceForDisplay: string, strikethroughPrice: string) => {
    navigation.navigate("HotelScreen", { hotelId, checkIn, checkOut, rooms, adults, currencyCode, priceDetails, priceForDisplay, strikethroughPrice });
  }
  const renderItem = ({ item }: { item: Daum }) => {
    const randomImageUrl = getRandomImage(); // Get a random image URL
    return (
      <View style={styles.itemContainer}>
        <Image
          source={{ uri: randomImageUrl }} // Use the random image
          style={styles.image}
          resizeMode="cover" // Adjust the image to cover the space
        />
        <TouchableOpacity onPress={() => goToHotelDetailScreen(item.id, checkIn, checkOut, rooms, adults, currencyCode, item.priceDetails ?? '', item.priceForDisplay, item.strikethroughPrice ?? '')}>
          <Text style={styles.title}>{item.title.replace(/[0-9.]+/g, '')}</Text>
        </TouchableOpacity>
        <Text style={styles.price}>{item.priceForDisplay}</Text>
      </View>
    );
  };

  return (
    <View>
      <Text style={styles.sortText}>{sort?.replace(/<span class="underline">/g, '').replace(/<\/span>/g, '')}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Show loader while loading
      ) : (
        <FlatList
          data={displayData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Ensure id is unique
          numColumns={2} // Set number of columns
          contentContainerStyle={styles.gridContainer} // Optional styling
        />
      )}
    </View>
  )
}

export default SearchList;
const styles = StyleSheet.create({
  gridContainer: {
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    marginBottom: 60, // Add margin at the bottom
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center', // Center align items
  },
  title: {
    fontFamily: 'PlusJakartaSans-ExtraBold',
    fontSize: 16,
    color: '#000000',
    margin: 8,
  },
  image: {
    width: '100%', // Full width of the container
    height: 100, // Set height of the image
    borderRadius: 5, // Rounded corners for the image
  },
  sortText: {
    fontSize: 14,
    color: '#000000',
    margin: 24,
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght'
  },
  price: {
    fontSize: 14,
    color: '#000000',
    margin: 8,
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght'
  }
})