/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import CodePush from 'react-native-code-push'

let codepushOptions = {
    checkFrequency: CodePush.CheckFrequency.MANUAL
}
export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            syncStatus: 0,
            syncStatusDesc: '',
            progressStr: '',
            progressPercent: '',
            num: 0,
        }
    }

    onCheckUpdate() {
        let num = this.state.num + 1;
        this.setState({ num });
        const syncOptions = {
            installMode: CodePush.InstallMode.IMMEDIATE,
            updateDialog: {
                appendReleaseDescription: true,
                descriptionPrefix: '注意：',
                mandatoryContinueButtonLabel: '立即更新',
                mandatoryUpdateMessageL: '有一个新版本需要更新，',
                optionalIgnoreButtonLabel: '忽略',
                optionalInstallButtonLabel: '安装',
                optionalUpdateMessage: '有新版本，是否要安装',
                title: '更新',
            }
        }
        CodePush.sync(syncOptions, this.syncStatusChangedCallback.bind(this),this.downloadProgressCallback.bind(this), );
    }

    syncStatusChangedCallback(syncStatus) {
        let syncStatusDesc = ''
        switch (syncStatus) {
            case CodePush.SyncStatus.UP_TO_DATE:
                syncStatusDesc = '已经是最新'
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                syncStatusDesc = '更新已安装'
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                syncStatusDesc = '更新被忽略'
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                syncStatusDesc = '未知错误'
                break;
            case CodePush.SyncStatus.SYNC_IN_PROGRESS:
                syncStatusDesc = '已有更新进行中'
                break;
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                syncStatusDesc = '检查更新中'
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                syncStatusDesc = '等待用户操作'
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                syncStatusDesc = '下载中'
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                syncStatusDesc = '安装中'
                break;
            default:
                syncStatusDesc = '错误'
        }
        this.setState({ syncStatusDesc, syncStatus })
    }

    downloadProgressCallback(progress) {
        let progressPercent = (progress.receivedBytes/progress.totalBytes).toFixed(2); 
        this.setState({progressStr:progress.receivedBytes + '/' + progress.totalBytes + " " + progressPercent + "%"})
    }

    handleBinaryVersionMismatchCallback() {

    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to updateDialog version2带状态详情 带进度 新增111</Text>
                <Text style={styles.instructions}>{this.state.num}</Text>
                <Button title='检查更新'
                    color='#336699'
                    onPress={() => this.onCheckUpdate()}
                    style={styles.checkBtn} />
                    <Text style={[styles.syncStatusLabel, {bottom: 50, color: '#234567'}]}>{this.state.progressStr}</Text>
                <Text style={styles.syncStatusLabel}>{this.state.syncStatusDesc + ' ' + this.state.syncStatus}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    checkBtn: {
        width: 100,
        height: 40,
        borderRadius: 20,
        margin: 10
    },
    syncStatusLabel: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 20,
        fontSize: 20,
        color: '#123456'
    }
});

App = CodePush(codepushOptions)(App);
