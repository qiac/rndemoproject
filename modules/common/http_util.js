import React, { Dimensions, AsyncStorage, Platform } from 'react-native';
import {GKAlert} from '../common/gk_util';

var HttpUtils = {

  /*
    * 基于fetch
    * @method get
    * @param {string} url
    * @param {function} callback 请求成功/失败回调
    */
    get: function(url, successFunc, failFunc, navigator, logoutFunc) {
      AsyncStorage.getItem('token', function(err, token) {
        // 执行网络请求
        if(!err && token) {
          var author =  "Token " + token;

          fetch(url, {
            method: 'get',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': author
            }
          })
          .then((res) => {
            if (res.ok) {
              res.json().then((data)=>{
                if(successFunc !== null) successFunc(data);
              });
            } else {

              //接口返回401,token失效
              if(res.status === 401){
                HttpUtils.noAuthRedirect(navigator, logoutFunc);
                return;
              }

              if(failFunc !== null) failFunc(res);
            }
          })
          .catch((e) => {
            if(failFunc !== null) failFunc(e);
          }).done();
        }
        // 未获取到token
        else {

          //接口返回401,token失效
          if(res.status === 401){
            HttpUtils.noAuthRedirect(navigator, logoutFunc);
            return;
          }

          if(failFunc !== null)  failFunc(err);
        }
      })
    },

    /*
     * 基于fetch
     * @method post
     * @param {string} url
     * @param {json} data
     * @param {function} callback 请求成功/失败回调
     */
    post: function(url, data, successFunc, failFunc, navigator, logoutFunc) {
      AsyncStorage.getItem('token', function(err, token) {
        // 执行网络请求
        if(!err && token) {
          var author =  "Token " + token;

          fetch(url, {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': author
            },
            body: data === null ? null : JSON.stringify(data)
          })
          .then((res) => {
            if (res.ok) {
              res.json().then((data)=>{
                if(successFunc !== null) successFunc(data);
              });
            } else {

              //接口返回401,token失效
              if(res.status === 401){
                HttpUtils.noAuthRedirect(navigator, logoutFunc);
                return;
              }

              if(failFunc !== null) failFunc(res);

            }
          })
          .catch((e) => {

            //接口返回401,token失效
            if(res.status === 401){
              HttpUtils.noAuthRedirect(navigator, logoutFunc);
              return;
            }

            if(failFunc !== null) failFunc(e);

          }).done();
        }
        // 未获取到token
        else {

          //接口返回401,token失效
          if(res.status === 401){
            HttpUtils.noAuthRedirect();
            return;
          }

          if(failFunc !== null)  failFunc(err);
        }
      })
    },
    /*
     * 基于fetch
     * @method post
     * @param {string} url
     * @param {json} data
     * @param {function} callback 请求成功/失败回调
     */
    login: function(url, data, successFunc, failFunc) {
      fetch(url, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: data === null ? null : JSON.stringify(data)
      })
      .then((res) => {
        if (res.ok) {
          res.json().then((data)=>{
            if(successFunc !== null) successFunc(data);
          });
        } else {
          if(failFunc !== null) failFunc(res);
        }
      })
      .catch((e) => {
        if(failFunc !== null) failFunc(e);
      }).done();
    },

  /*
   * token失效,跳转到登录页
   */
    noAuthRedirect : function(navigator, clearToken){
      GKAlert.alert(
          '提醒',
          '哎吆,系统检测到您的帐户在另一台设备上登录,您已被迫下线了!',
          [
            {
              text: '确定',
              onPress: function(){
                AsyncStorage.setItem('token', '', (err) => {
                  if (!err) {
                    if(clearToken !== null && clearToken !== undefined)
                      clearToken();
                    navigator.popToRoute(navigator.getCurrentRoutes()[0]);
                  }
                });
              }
            }
          ]
      );

    }
};

module.exports = HttpUtils;