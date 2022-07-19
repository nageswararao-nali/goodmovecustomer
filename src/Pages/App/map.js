import React, { useState, useEffect } from "react";
import { RefreshControl, StyleSheet, Dimensions, Image, AsyncStorage, View, TextInput, Text, TouchableOpacity, Keyboard, ScrollView, 
    KeyboardAvoidingView, FlatList, ActivityIndicator, Alert, Modal, TouchableHighlight } from 'react-native';
import {
  INFINITE_ANIMATION_ITERATIONS,
  LatLng,
  WebViewLeaflet,
  WebViewLeafletEvents,
  WebviewLeafletMessage,
  AnimationType,
  MapShapeType
} from "react-native-webview-leaflet";
import * as Location from "expo-location";
// import * as Permissions from "expo-permissions";
import base64Image from './web/webBase64Image';
let LatLngObject = { };
let locations = [];

const getDuration = () => Math.floor(Math.random() * 3) + 1;
const getDelay = () => Math.floor(Math.random()) * 0.5;
const iterationCount = "infinite";


export default function Map(props) {
   
  var [mapCenterPosition, setMapCenterPosition] = useState(null);
  var [myMarker, setmyMarker] = useState(null);
  var [zoom, setzoom] = useState(7);
  const [ownPosition, setOwnPosition] = useState(null);
  const [webViewLeafletRef, setWebViewLeafletRef] = useState(null);
	
  const onMessageReceived = (message) => {
    switch (message.event) {
      case WebViewLeafletEvents.ON_ZOOM_END:
        const zoom = message.payload.zoom;
        setzoom(zoom);
        break;
      case WebViewLeafletEvents.ON_MAP_TOUCHED:
        const position = message.payload
          .touchLatLng;
        // Alert.alert(`Map Touched at:`, `${position.lat}, ${position.lng}`);
        setMapCenterPosition(position)
        const changedLocation = [
          {
            icon: "📍",
            position: { lat: position.lat, lng: position.lng },
            animation: {
              name: 'pulse',
              duration: '1',
              delay: 0,
              interationCount: '2'
            },
          }
        ];
        setmyMarker(changedLocation);
		    props.parentMethod(position);
        break;
      default:
        //console.log("App received", message);
    }
  };

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    /* let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.warn("Permission to access location was denied");
    } */

    let location = await Location.getCurrentPositionAsync({});
    if (!ownPosition) {
      setOwnPosition({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    }
	  var position = {lat: location.coords.latitude,lng: location.coords.longitude}
    setMapCenterPosition(position);
    const changedLocation = [
      {
        icon: "📍",
        position: { lat: location.coords.latitude, lng: location.coords.longitude },
        animation: {
          name: 'pulse',
          duration: '1',
          delay: 0,
          interationCount: '2'
        },
      }
    ];
    setmyMarker(changedLocation);
  };

  return (
    <View style={styles.MainContainer}>
      <View style={{ flex: 1 }}>
        {
          <WebViewLeaflet
            ref={(ref) => {
              setWebViewLeafletRef(ref);
            }}
            
          />
        }
      </View>
    </View>
  );
}
/** style of page */
const { height } = Dimensions.get('window')
const styles = StyleSheet.create({
  MainContainer: {
		flex: 1,
		//height : height-89
		height: height - 200
	},
  header: {
    height: 60,
    backgroundColor: "dodgerblue",
    paddingHorizontal: 10,
    paddingTop: 30,
    width: "100%"
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },
  mapControls: {
    backgroundColor: "rgba(255,255,255,.5)",
    borderRadius: 5,
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 0,
    marginHorizontal: 10,
    padding: 7,
    position: "absolute",
    right: 0
  },
  mapButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 42
  },
  mapButtonEmoji: {
    fontSize: 28
  }
});
