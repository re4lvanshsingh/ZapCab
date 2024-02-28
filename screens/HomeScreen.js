import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'
import React,{useRef} from 'react'
import tw from 'twrnc';
import NavOptions from '../components/NavOptions.js';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from '@env'
import { useDispatch } from 'react-redux';
import { setDestination,setOrigin } from '../slices/navSlice.js';
import NavFavourites from '../components/NavFavourites.js';
import { FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { FavouriteLocations } from '../db/FavouriteLocations.js'

const HomeScreen = () => {
    const dispatch = useDispatch();
    const autocompleteRef = useRef(null);

    const handleButtonPress = ({destination,data,details}) => {
        // Set the location value programmatically
        autocompleteRef.current.setAddressText(destination);
        dispatch(setOrigin({
            location: details,
            description: data
        }));
      };

    return (
    <SafeAreaView style={tw `bg-white flex-1`}>
        <View style={tw `p-5`}>
            {/* The name of our app - ZapCab (an Electric Vehicle Ride app for the new-modern generation)*/}
            <Text style={{color:"black", paddingTop:30, paddingBottom:5 ,fontWeight:"bold",fontSize:35 }}>ZapCab</Text>

            {/* The Google Places Autocomplete widget/textbox */}
            <GooglePlacesAutocomplete
                ref={autocompleteRef}
                placeholder='Where From?'
                styles={{
                    container: {
                        flex: 0,
                    },
                    textInput: {
                        fontSize: 18,
                    },
                }}
                onPress={(data,details=null) => {
                    // for debugging purposes only. Intentionally kept inside:-
                    // console.log(data.description);
                    // console.log(details.geometry.location);

                    dispatch(setOrigin({
                        location: details.geometry.location,
                        description: data.description
                    }));
                }}
                
                fetchDetails={true}
                returnKeyType={"search"}
                enablePoweredByContainer={false}
                minLength={2}
                query={{
                    key: GOOGLE_MAPS_APIKEY,
                    language: "en"
                }}

                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={400}
            />

            {/* This is for the options section - Ride / Get Food (future addition) */}
            <NavOptions/>
            
            {/* This is for the favourites section */}
            <FlatList
            nestedScrollEnabled={true}
                data={FavouriteLocations}
                keyExtractor={(item)=>item.id}
                style={{paddingBottom: 20}}
                ItemSeparatorComponent={()=>(
                    <View
                        style={[tw `bg-gray-200`, {height: 0.5}]}
                    />
                )}
                renderItem={({item: {location, destination, icon, data, details}})=>(
                    <TouchableOpacity style={tw `flex-row items-center p-5`}
                        onPress={()=>handleButtonPress({destination,data,details})}
                    >
                        <Icon
                            style={tw `mr-4 rounded-full bg-gray-300 p-3`}
                            name={icon}
                            type="ionicon"
                            colors="white"
                            size={18}
                        /> 
                        <View>
                            <Text style={tw `font-semibold text-lg`}>{location}</Text>
                            <Text style={tw `text-gray-500`}>{destination}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />

        </View>
    </SafeAreaView>
  )
}

export default HomeScreen