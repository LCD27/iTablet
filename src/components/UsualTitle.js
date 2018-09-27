/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableHighlight } from 'react-native'
import * as Util from '../utils/constUtil'
import { TextBtn } from '../components'
import { scaleSize} from '../utils'
const WIDTH = Util.WIDTH
const themeColor = Util.USUAL_GREEN
const headColor = Util.USUAL_BLUE

export default class UsualTitle extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const bgColorCon = this.props.headColor ? { backgroundColor: this.props.headColor } : null
    const bgColorTitle = this.props.themeColor ? { backgroundColor: this.props.themeColor } : null
    return (
      <View style={styles.container}>
        <View style={[styles.title, bgColorTitle]}>
          <Text style={styles.titleText}>{this.props.title ? this.props.title : '默认标题'}</Text>
          {this.props.isRightBtn && <TextBtn btnText={this.props.btnText} btnClick={this.props.btnClick} />}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor:'white',
  },
  title: {
    marginLeft: scaleSize(28),
    marginBottom: 1,
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    marginLeft: scaleSize(20),
    fontSize: scaleSize(30),
    color:"#555555",
  },
})