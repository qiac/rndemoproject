//
//  RNCorrespond.m
//  RNRecruiterProj
//
//  Created by taobangping on 16/5/3.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RNCorrespond.h"
#import "GKChatViewController.h"

@implementation RNCorrespond

RCT_EXPORT_MODULE();

// -------- 登录成功回调 ---------
// token : 登录Token
// ease_username : 环信账号
// ease_password : 环信密码
// ease_avatar : 环信头像
RCT_EXPORT_METHOD(login:(NSString *) token
                  ease_username:(NSString*) ease_username
                  ease_password:(NSString*) ease_password
                  ease_avatar:(NSString*) ease_avatar) {
    
}

// -------- 登出成功回调 ---------
RCT_EXPORT_METHOD(logout) {
    
}

// -------- 拨打本地电话回调 ---------
// phonenum : 电话号码
RCT_EXPORT_METHOD(makeCall:(NSString *) phonenum) {
    
}

// -------- 分享回调 ---------
// shareUrl : 分享Url地址
// sharePic : 分享图标
// shareTitle : 分享标题
// shareDesc : 分享描述
RCT_EXPORT_METHOD(share:(NSString *) shareUrl
                  sharePic:(NSString*) sharePic
                  shareTitle:(NSString*) shareTitle
                  shareDesc:(NSString*) shareDesc) {
    
}

// -------- 删除会话回调 ---------
// ease_username : 环信账号
RCT_EXPORT_METHOD(removeConversation:(NSString *) ease_username) {
    
}

// -------- 获取会话列表 ---------
// ease_username : 环信用户名, 当为空时, 则获取所有的会话信息
RCT_EXPORT_METHOD(getAllConversations:(RCTResponseSenderBlock) callback) {
    
}


// -------- 进入IM聊天界面回调 ---------
// to_username : 聊天对方环信账户
RCT_EXPORT_METHOD(openIMChat:(NSString *) to_username)
{
    NSLog(@"接收到来自ReactNative传递的参数：name=%@", to_username);
    
    dispatch_sync(MAIN_QUEUE, ^{
        GKChatViewController *chatViewController = [[GKChatViewController alloc] initWithConversationChatter:@"18625177334" conversationType:EMConversationTypeChat];
    
        UIViewController* rootVC = [UIApplication sharedApplication].keyWindow.rootViewController;
        [rootVC presentViewController:[[UINavigationController alloc]initWithRootViewController:chatViewController] animated:YES completion:nil];
    });
}

// -------- 获取App版本号回调 ---------
RCT_EXPORT_METHOD(getAppVersion:(RCTResponseSenderBlock) callback) {
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *appVersion = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    
    callback(@[appVersion]);
}

@end
