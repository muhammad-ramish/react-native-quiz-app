import React from 'react';
import { Text , View , StatusBar , Button , Alert , StyleSheet } from 'react-native';

// shuffle an arry of ans1
function shuffle(array) {
var currentIndex = array.length, temporaryValue, randomIndex;

// While there remain elements to shuffle...
while (0 !== currentIndex) {

  // Pick a remaining element...
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex -= 1;

  // And swap it with the current element.
  temporaryValue = array[currentIndex];
  array[currentIndex] = array[randomIndex];
  array[randomIndex] = temporaryValue;
}

return array;
}

// seconds in mins and hasCameraPermission
function fancyTimeFormat(time)
{
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}



export default class Questions extends React.Component {
  constructor(props){
      super(props);

      this.nextQues = this.nextQues.bind(this);
      this.retake = this.retake.bind(this);
    }

    state = {
      qno: 1,
      load: 0,
      score: 1,
      ques:  (this.props.ques !== undefined) ? this.props.ques : [],
      question: '',
      ans1: '',
      ans2: '',
      ans3: '',
      ans4: '',
      ans: '',
      end: false,
      timer: 0,
    }

  async componentDidMount(){
    // console.log(this.state.ques)
    let arr = [this.state.ques.results[0].correct_answer,
               this.state.ques.results[0].incorrect_answers[0],
               this.state.ques.results[0].incorrect_answers[1],
               this.state.ques.results[0].incorrect_answers[2],
    ]
    arr = shuffle(arr);
    this.setState({
      question: this.state.ques.results[0].question,
      ans1: arr[0],
      ans2: arr[1],
      ans3: arr[2],
      ans4: arr[3],
      ans: this.state.ques.results[0].correct_answer,
    })

    this.interval = setInterval(
      () => this.setState((prevState)=> ({ timer: prevState.timer + 1 })),
      1000
    );
  }

  componentDidUpdate(){
    if(this.state.end){
      clearInterval(this.interval);
    }
  }



  selectAns(ans){
    this.setState({
      selectAns: ans,
      selected: true
    })
  }

  nextQues(){
    const {selected , load , qno , selectAns , ans , score , timer} = this.state;
    if(qno === 10){
      let time = fancyTimeFormat(timer)
      this.setState({
        end: true,
        timer: time,
      })
    }
    else{
      if(selected){
        let arr = [this.state.ques.results[load+1].correct_answer ,
                this.state.ques.results[load+1].incorrect_answers[0],
                this.state.ques.results[load+1].incorrect_answers[1],
                this.state.ques.results[load+1].incorrect_answers[2]
        ]
        arr = shuffle(arr);

        this.setState({
          selected: false,
          load: load+1,
          qno: qno+1,
          score: (selectAns === ans) ? score+1 : score,
          question: this.state.ques.results[load+1].question,
          // ans1: this.state.ques.results[load+1].correct_answer,
          // ans2: this.state.ques.results[load+1].incorrect_answers[0],
          // ans3: this.state.ques.results[load+1].incorrect_answers[1],
          // ans4: this.state.ques.results[load+1].incorrect_answers[2],
          ans: this.state.ques.results[load+1].correct_answer,
          ans1: arr[0],
          ans2: arr[1],
          ans3: arr[2],
          ans4: arr[3],
        })
      }
      else{
        Alert.alert(
          'Error',
          'Please Select An Option',
          [
            {text: 'OK'},
          ],
          { cancelable: true }
        )
      }
    }
  }

  retake(){
    this.props.retake(true);
  }

  render() {
    const {qno , load , score , ques, selectAns , end , timer } = this.state;

    return (
      <View style={{height: '100%', paddingTop: 20, flex: 1, flexDirection: 'column'}}>
        <StatusBar
           backgroundColor="transparent"
           barStyle="light-content"
         />
         <View style={{height: 40, backgroundColor: '#0d599c'}}>
          <Text style={{textAlign: 'center', lineHeight: 40, color: '#fff', fontSize: 22}}>Quiz App</Text>
         </View>

         {end ?
           <View style={{padding: 20}}>
           <Text style={{textAlign: 'center', fontSize: 20, paddingTop: 11}}>Finished!</Text>
           <Text style={{textAlign: 'center', fontSize: 20, paddingTop: 11}}>Your score is: {score}</Text>
           <Text style={{textAlign: 'center', fontSize: 20, paddingTop: 11}}>Time taken: {timer}</Text>
            <View style={{marginTop: 20}}>
             <Button
                onPress={this.retake}
                title="Re-Take Quiz"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
              />
            </View>
           </View>
           :

           <View style={{padding: 20}}>

             <Text style={{fontSize: 20, paddingTop: 11}}>Q#{qno}: {this.state.question}</Text>
             <Text onPress={this.selectAns.bind(this, this.state.ans1)} style={[styles.text, (selectAns === this.state.ans1)? styles.selected : styles.normal]}>a) {this.state.ans1}</Text>
             <Text onPress={this.selectAns.bind(this, this.state.ans2)} style={[styles.text, (selectAns === this.state.ans2)? styles.selected : styles.normal]}>b) {this.state.ans2}</Text>
             <Text onPress={this.selectAns.bind(this, this.state.ans3)} style={[styles.text, (selectAns === this.state.ans3)? styles.selected : styles.normal]}>c) {this.state.ans3}</Text>
             <Text onPress={this.selectAns.bind(this, this.state.ans4)} style={[styles.text, (selectAns === this.state.ans4)? styles.selected : styles.normal]}>d) {this.state.ans4}</Text>

             <View style={{alignItems: 'flex-end', marginTop: 15}}>
               <Button
                  onPress={this.nextQues}
                  title="Next"
                  color="#841584"
                  accessibilityLabel="Learn more about this purple button"
                />
              </View>

           </View>
         }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16, marginTop: 20, lineHeight: 20, padding: 10,
    },
    selected: {
        backgroundColor: '#eff0f1',
    },
    normal: {
        backgroundColor: 'transparent',
    },
});
