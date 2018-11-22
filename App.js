import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { FaceDetector } from 'expo';
import { Camera, Permissions } from 'expo';
import Questions from './Questions'

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.startQuiz = this.startQuiz.bind(this);
    this.reTakeQuiz = this.reTakeQuiz.bind(this);

  }

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
    faces: false,
    allQues: [],
    start: false,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    const response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple");
    const json = await response.json();
    this.setState({
      allQues: json
    })
  }

  handleFacesDetected  = async ({ faces }) => {
    if(faces.length > 0){
      this.setState({ faces: true });
      // console.log(faces);
    }
  }

  startQuiz(){
    this.setState({
      start: true
    })
  }

  ques = (data) => {
    alert(smh)
  }

  async reTakeQuiz(val){
    let response = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple");
    let json = await response.json();
    this.setState({
      start: false,
      allQues: json,
    })
  }

  render() {
    const { hasCameraPermission, faces , allQues , start } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>

          {faces ?
            start ?
              <Questions ques={allQues} retake={this.reTakeQuiz} />
            :
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button
                   onPress={this.startQuiz}
                   title="Start Quiz"
                   color="#841584"
                   accessibilityLabel="Learn more about this purple button"
                 />
               </View>
          :
            <Camera
              onFacesDetected={this.handleFacesDetected}
              faceDetectorSettings={{
                mode: FaceDetector.Constants.Mode.fast,
                detectLandmarks: FaceDetector.Constants.Mode.none,
                runClassifications: FaceDetector.Constants.Mode.none,
              }}
            style={{ flex: 1 }} type={this.state.type}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
              </View>
            </Camera>
            }
        </View>
      );
    }
  }
}


// export default class App extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text>hello!</Text>
//       </View>
//     );
//   }
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
