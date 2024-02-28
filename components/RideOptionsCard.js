import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import tw from 'twrnc';
import { Image } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import {  useSelector } from 'react-redux';
import { selectTravelTimeInformation, setDestination } from '../slices/navSlice.js';

const data = [
  {
    id: "Zap-X-123",
    title: "ZapX",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
    eta: 5
  },
  {
    id: "Zap-XL-456",
    title: "ZapXL",
    multiplier: 1.2,
    image: "https://links.papareact.com/5w8",
    eta: 3
  },
  {
    id: "Zap-LUX-789",
    title: "ZapLUX",
    multiplier: 1.75,
    image: "https://links.papareact.com/7pf",
    eta: 10
  },
];

const SURGE_CHARGE_RATE=1;

const RideOptionsCard = () => {
  const navigation = useNavigation();
  const handleNavigateBack = () => {
    navigation.navigate("NavigateCard");
  };

  const [selected, setSelected] = useState(null);

  const travelTimeInformation = useSelector(selectTravelTimeInformation);

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <View style={tw`flex-1`}>
        <Text style={tw`text-center py-4 text-xl`}>Select a Ride - {travelTimeInformation?.distance.text} ({travelTimeInformation?.duration?.text})</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item: { id, title, multiplier, image, eta }, item }) => (
            <TouchableOpacity
              onPress={() => setSelected(item)}
              style={tw`flex-row justify-between items-center px-10 ${id === selected?.id && "bg-gray-200"}`}
            >
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: "contain",
                }}
                source={{ uri: image }}
              />

              <View style={tw`-ml-6`}>
                <Text style={tw`text-xl font-semibold`}>{title}</Text>
                <Text>ETA: {eta} mins</Text>
              </View>
              <Text style={tw`text-xl`}>
                {new Intl.NumberFormat('en-gb',{
                    style: 'currency',
                    currency: 'GBP'
                }).format(
                    (travelTimeInformation?.duration?.value * SURGE_CHARGE_RATE * multiplier/60)
                )}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={tw`mt-auto border-t border-gray-200`}>
        <TouchableOpacity 
        disabled={!selected}
        style={tw`bg-black py-3 m-3 ${!selected && "bg-gray-300"}`}>
          <Text style={tw`text-center text-white text-xl`}>
            Choose {selected?.title}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RideOptionsCard;
