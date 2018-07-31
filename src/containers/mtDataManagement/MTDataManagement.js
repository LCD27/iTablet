import * as React from 'react'
import { SectionList } from 'react-native'
import { Container, ListSeparator, DataSetListSection, DataSetListItem } from '../../components'
import { Toast } from '../../utils'
import { DataManagerTab } from './components'
import NavigationService from '../NavigationService'
import { Action } from 'imobile_for_javascript'

// import styles from './styles'

export default class MTDataManagement extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.mapControl = params.mapControl
    this.map = params.map
    this.cb = params.cb
    this.state = {
      dataSourceList: [],
      openList: {},
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.container.setLoading(true)
    try {
      let list = []
      let dataSources = await this.workspace.getDatasources()
      let count = await dataSources.getCount()
      for (let i = 0; i < count; i++) {
        let dataSetList = []
        let dataSource = await dataSources.get(i)
        let name = await dataSource.getAlias()
        let dataSets = await dataSource.getDatasets()
        let dataSetCount = await dataSets.getCount()
        for (let j = 0; j < dataSetCount; j++) {
          let dataset = await dataSets.get(j)
          let dsName = await dataset.getName()
          let dsType = await dataset.getType()

          dataSetList.push({
            name: dsName,
            type: dsType,
            dataset: dataset,
            section: i,
            key: i + '-' + dsName,
          })
        }

        list.push({
          key: name,
          isShow: true,
          data: dataSetList,
          index: i,
          datasource: dataSource,
        })
      }
      await this.mapControl.setAction(Action.PAN)
      this.setState({
        dataSourceList: list,
      }, () => {
        this.container.setLoading(false)
      })
    } catch (e) {
      this.container.setLoading(false)
    }
  }

  showSection = (section, isShow?: boolean) => {
    let newData = this.state.dataSourceList
    if (isShow === undefined) {
      section.isShow = !section.isShow
    } else {
      section.isShow = isShow
    }
    newData[section.index] = section
    this.setState({
      dataSourceList: newData.concat(),
    })
  }

  select = data => {
    let newList = this.state.openList
    if (newList[data.section + '-' + data.name]) {
      delete(newList[data.section + '-' + data.name])
    } else {
      newList[data.section + '-' + data.name] = data
    }
    this.setState({
      openList: newList,
    })
  }

  _dSource = () => {
    NavigationService.navigate('NewDSource', {workspace: this.workspace, map: this.map, cb: this.getData})
  }

  _dSet = () => {
    NavigationService.navigate('ChooseDatasource', {workspace: this.workspace, map: this.map, data: this.state.dataSourceList, cb: this.getData})
  }

  addToMap = item => {
    (async function () {
      try {
        let id = await this.map.addLayer(item.data.dataset, true)
        if (id) {
          Toast.show('添加图层成功')
        } else {
          Toast.show('添加图层失败')
        }
      } catch (e) {
        Toast.show('添加图层失败')
      }

      // this.props.navigation.goBack()
    }).bind(this)()
  }

  rename = data => {

  }

  delete = data => {

  }

  attribute = data => {

  }

  attrTable = data => {

  }

  getSectionOption = () => {
    return (
      [
        { key: '重命名', action: data => this.rename(data) },
        { key: '删除', action: data => this.delete(data) },
      ]
    )
  }

  getOption = item => {
    return (
      [
        { key: '添加到当前地图', dataset: item.dataset, action: data => this.addToMap(data) },
        { key: '重命名', dataset: item.dataset, action: data => this.rename(data) },
        { key: '删除', dataset: item.dataset, action: data => this.delete(data) },
        { key: '属性', dataset: item.dataset, action: data => this.attribute(data) },
        { key: '浏览属性表', dataset: item.dataset, action: data => this.attrTable(data) },
      ]
    )
  }

  _renderSetion = ({ section }) => {
    return (
      <DataSetListSection
        data={section}
        onPress={this.showSection}
        options={this.getSectionOption()}
      />
    )
  }

  _renderItem = ({ item }) => {
    return (
      <DataSetListItem
        hidden={!this.state.dataSourceList[item.section].isShow}
        data={item}
        height={60}
        onPress={this.select}
        options={this.getOption(item)}
      />
    )
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.isShow ? <ListSeparator /> : null
  }

  _renderSectionSeparatorComponent = ({ section }) => {
    return section.isShow ? <ListSeparator /> : null
  }

  _keyExtractor = item => (item.key + item.index)

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        headerProps={{
          title: '数据管理',
          navigation: this.props.navigation,
        }}>
        <DataManagerTab dSource={this._dSource} dSet={this._dSet}/>
        <SectionList
          renderSectionHeader={this._renderSetion}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          sections={this.state.dataSourceList}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          SectionSeparatorComponent={this._renderSectionSeparatorComponent}
        />
      </Container>
    )
  }
}