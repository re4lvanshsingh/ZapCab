import { StyleSheet, Text, View } from 'react-native'
import React,{useState,useEffect} from 'react'
import tw from 'twrnc'
import Map from '../components/Map.js'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import NavigateCard from '../components/NavigateCard.js'
import RideOptionsCard from '../components/RideOptionsCard.js'
import NetInfo from "@react-native-community/netinfo";
import OfflineNotification from '../components/Offline.js';

const MapScreen = () => {
    const Stack= createNativeStackNavigator();

    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        // Subscribe to network state changes
        const unsubscribe = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected);
        });

        // Don't forget to unsubscribe when component unmounts
        return () => {
        unsubscribe();
        };
    }, []);

  return (
    <View>

      <View style={tw `h-1/2`}>
        <Map/>
      </View>
      
      <View style={tw `h-1/2`}>
            <Stack.Navigator>
                <Stack.Screen
                    name="NavigateCard"
                    component={NavigateCard}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="RideOptionsCard"
                    component={RideOptionsCard}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
            {/* For checking the connection - if we are connected or not */}
            {!isConnected && <OfflineNotification/>}
      </View>
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({})