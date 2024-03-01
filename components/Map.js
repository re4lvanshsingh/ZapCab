import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import MapView, {Marker} from 'react-native-maps'
import tw from 'twrnc'
import { StatusBar } from 'expo-status-bar'
import { useDispatch, useSelector } from 'react-redux'
import {selectDestination, selectOrigin, setTravelTimeInformation} from "../slices/navSlice.js"
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_MAPS_APIKEY } from '@env'
import { useRef } from 'react'
import { Icon } from 'react-native-elements'
import { Image } from 'react-native-elements'

const CarMarkerLUX = ({ coordinate }) => (
    <Marker coordinate={coordinate}>
        <Image source={require('../assets/zapLUX.png')} style={{height: 50, width:60 }} />
    </Marker>
);

const CarMarkerXL = ({ coordinate }) => (
    <Marker coordinate={coordinate}>
        <Image source={require('../assets/zapXL.png')} style={{height: 50, width:60 }} />
    </Marker>
);

const CarMarkerX = ({ coordinate }) => (
    <Marker coordinate={coordinate}>
        <Image source={require('../assets/zapX.png')} style={{height: 50, width:60 }} />
    </Marker>
);

const Map = () => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const mapRef=useRef(null);
    const dispatch = useDispatch();

    const DriversData=[
        { lat: origin.location.lat - 0.005, lng: origin.location.lng - 0.005, component: CarMarkerLUX },
        { lat: origin.location.lat + 0.005, lng: origin.location.lng + 0.005, component: CarMarkerXL },
        { lat: origin.location.lat + 0.0001, lng: origin.location.lng + 0.001, component: CarMarkerXL },
        { lat: origin.location.lat - 0.003, lng: origin.location.lng + 0.005, component: CarMarkerX },
        { lat: origin.location.lat + 0.005, lng: origin.location.lng - 0.002, component: CarMarkerX }
    ];

    useEffect(()=>{

        if(!origin || !destination)return;

        //Fit to the markers:
        mapRef.current.animateToRegion({
            latitude: (origin.location.lat + destination.location.lat) / 2,
            longitude: (origin.location.lng + destination.location.lng) / 2,
            latitudeDelta: Math.abs(origin.location.lat - destination.location.lat) * 1.2,
            longitudeDelta: Math.abs(origin.location.lng - destination.location.lng) * 1.2,
          });
          
    },[origin,destination]);

    useEffect(()=>{
        if((!origin) || (!destination))return;

        const getTravelTime = async () => {
            const originLatLng = `${origin.location.lat},${origin.location.lng}`;
            const destinationLatLng = `${destination.location.lat},${destination.location.lng}`;
          
            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${originLatLng}&destinations=${destinationLatLng}&key=${GOOGLE_MAPS_APIKEY}`)
              .then(res => res.json())
              .then((data) => {
                // for debugging purposes only:
                // console.log(data);
                dispatch(setTravelTimeInformation(data.rows[0].elements[0]));
            })
        };
          

        getTravelTime();
    },[origin,destination,GOOGLE_MAPS_APIKEY])

  return (
     <MapView
       ref={mapRef}
       style={tw `flex-1`}
       mapType='mutedStandard'
       initialRegion={{
         latitude: origin.location.lat,
         longitude: origin.location.lng,
         latitudeDelta: 0.005,
         longitudeDelta: 0.005,
       }}
       showsUserLocation={true}
     >
        
        {origin && destination && (
            <MapViewDirections
            origin={{ latitude: origin.location.lat, longitude: origin.location.lng }}
            destination={{ latitude: destination.location.lat, longitude: destination.location.lng }}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeColor='black'
            strokeWidth={3}
          />
        )}

        {/*Display nearby drivers*/}
        {origin && DriversData.map(({ lat, lng, component: Component }, index) => (
            <Component
                key={index}
                coordinate={{ latitude: lat, longitude: lng }}
            />
        ))}
        
        {origin?.location && (
    <Marker
        coordinate={{
            latitude: origin.location.lat,
            longitude: origin.location.lng,
        }}
        title='Origin'
        description={origin.description}
        identifier='origin'  // Use key instead of identifier
    />
)}

{destination?.location && (
    <Marker
        coordinate={{
            latitude: destination.location.lat,
            longitude: destination.location.lng,
        }}
        title='Destination'
        description={destination.description}
        identifier='destination'  // Use key instead of identifier
    />
)}

    </MapView>
  )
}

export default Map