import React, { useEffect, useMemo, useState } from 'react'
import { Alert, AppState, NativeEventEmitter, NativeModules, PermissionsAndroid, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native'

import { Container, ButtonAction,TextButton,LabelHeight } from './styles'
import BleManager, { Peripheral } from 'react-native-ble-manager';
import  {convertString}  from 'convert-string'
const BleManagerModule = NativeModules.BleManager
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const PERIPHERALID = 'A4:CF:12:61:50:2A'
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b'
const CHARACTERISTIC_UUID ='beb5483e-36e1-4688-b7f5-ea07361b26a8'

const Main: React.FC = () => {
  const [goingUp, setGoingUp] = useState(false)
  const [goingDown,setGoingDown] = useState(false)

  const [deviceConnected,setDeviceConnected] = useState(false);

  const [scanning, setScanning] = useState(false)
  const [appState, setAppState] = useState('')
  const [peripherals, setPeripherals] = useState(new Map())


  useEffect(()=>{

    AppState.addEventListener('change', handleAppStateChange)
    BleManager.start({showAlert: false})

    const handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',handleDiscoverPeripheral)
    const handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan)
    const handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
    const handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
          if (result) {
            console.log("Permission is OK");
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
              if (result) {
                console.log("User accept");
              } else {
                console.log("User refuse");
              }
            });
          }
    });
  }
return()=>{
  handlerDiscover.remove()
  handlerStop.remove()
  handlerDisconnect.remove()
  handlerUpdate.remove()
}
  },[])

  const handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    setAppState(nextAppState);
  }

  const handleDiscoverPeripheral = (peripheral) =>{
    var _peripherals = peripherals;
    //console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    //console.log(peripheral.id + ' | '+peripheral.name)
    console.log(peripheral)
    if(!_peripherals.has(peripheral.id)){
      _peripherals.set(peripheral.id, peripheral);
      setPeripherals(_peripherals);
    }
  }

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setScanning(false);

  }

  const startScan = () => {
    if (!scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.scan([], 3, false).then((results) => {
        console.log('Scanning...');
        setScanning(true);
      });

    }
  }

  const handleDisconnectedPeripheral = (data)=> {
    let _peripherals = peripherals;
    let peripheral = _peripherals.get(data.peripheral);
    if (peripheral) {
        peripheral.connected = false;
        _peripherals.set(peripheral.id, peripheral);
        setPeripherals(_peripherals);
      }
    console.log('Disconnected from ' + data.peripheral);
  }

  const handleUpdateValueForCharacteristic = (data)=>{
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  const retrieveConnected = ()=> {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      console.log(results);
      var _peripherals = peripherals;
      for (var i = 0; i < results.length; i++) {
            var peripheral = results[i];
            //peripheral = true;
            peripherals.set(peripheral.id, peripheral);
            setPeripherals(_peripherals);
      }
    });
  }

  const handleUp = () => {
     setGoingUp(true)
      console.log('pressed =>',goingUp)
      //console.log(BluetoothSerial)
      //startScan()


        // Success code

          BleManager.startNotification(
           PERIPHERALID,
            SERVICE_UUID,
            CHARACTERISTIC_UUID).then((value)=>
            console.log("Read ",value))
            .catch((error)=>console.log("falha ",error))

  }
  const handleDown =()=>{
    setGoingDown(true)
  }

  const handleStop = () => {
    console.log('unpressed=> ',goingUp)
    setGoingUp(false)
    setGoingDown(false)
  }

  const handleConnect =()=>{
    BleManager.connect(PERIPHERALID).then((value)=>{
      setDeviceConnected(true)
      //handleCreateBond('A4:CF:12:61:50:2A')
    }).catch((error)=>{
      console.log(error)
    })
  }

  const handleSendData = () => {

  }

  const handleCreateBond = (peripheralId: string) => {
    BleManager.createBond(peripheralId,'')
      .then(() => {
        console.log("createBond success or there is already an existing one");
      })
      .catch(() => {
        console.log("fail to bond");
      });
  }
  return (

  <Container
    onStartShouldSetResponder={()=> true}
    onResponderStart={()=>console.log('pressedIn')}
    onResponderEnd={()=>console.log('pressedEnd')}
  >
    <TouchableOpacity onPress={handleConnect}>
      {!deviceConnected ?  <Text>Connect</Text> : <Text>Connected</Text>}
    </TouchableOpacity>
    {deviceConnected && (
    <>
      <ButtonAction onPressIn={handleUp} onPressOut={handleStop}>
            {({pressed})=> pressed ? <TextButton>GOING UP</TextButton> : <TextButton>UP</TextButton>}
        </ButtonAction>
          <LabelHeight>{goingUp.toString()}</LabelHeight>
        <ButtonAction onPressIn={handleDown} onPressOut={handleStop}>
        {({pressed})=> pressed ? <TextButton>GOING Down</TextButton> : <TextButton>Down</TextButton>}
      </ButtonAction>
    </>
    )}

    </Container>
)}

export default Main
