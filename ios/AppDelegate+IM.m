//
//  AppDelegate+IM.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/3.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "AppDelegate+IM.h"
#import "GKIMUtils.h"

@implementation AppDelegate (IM)

- (void)initEM:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    EMOptions *options = [EMOptions optionsWithAppkey:@"gikoo#gikoorecruitment"];
    
#ifdef DEBUG
    options.apnsCertName = @"recruiter_dev";
#else
    options.apnsCertName = @"recruiter";
#endif
    
    [[EMClient sharedClient] initializeSDKWithOptions:options];
    
    [[EaseSDKHelper shareHelper] easemobApplication:application
                      didFinishLaunchingWithOptions:launchOptions
                                             appkey:@"gikoo#gikoorecruitment"
                                       apnsCertName:@"istore_dev"
                                        otherConfig:@{kSDKConfigEnableConsoleLogger:[NSNumber numberWithBool:YES]}];
    
    [[EMClient sharedClient] addDelegate:self delegateQueue:nil];
    
    [self loginIfNeeded];
}

- (void)registerApns:(UIApplication *)application {
    if ([application respondsToSelector:@selector(registerForRemoteNotifications)]) {
        [application registerForRemoteNotifications];
        UIUserNotificationType notificationTypes = UIUserNotificationTypeBadge |
        UIUserNotificationTypeSound |
        UIUserNotificationTypeAlert;
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:notificationTypes categories:nil];
        [application registerUserNotificationSettings:settings];
    }
    else{
        UIRemoteNotificationType notificationTypes = UIRemoteNotificationTypeBadge |
        UIRemoteNotificationTypeSound |
        UIRemoteNotificationTypeAlert;
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:notificationTypes];
    }
}

- (void)loginIfNeeded {
    if ([GKIMUtils isLogin]) {
        return;
    }
    
#ifdef DEBUG
    [GKStorageVariableUtils sharedGKStorageVariableUtils].username = @"2-15-1453169169.908541";
    [GKStorageVariableUtils sharedGKStorageVariableUtils].password = @"123456";
#endif
    
    NSString* username = [GKStorageVariableUtils sharedGKStorageVariableUtils].username;
    NSString* password = [GKStorageVariableUtils sharedGKStorageVariableUtils].password;
    
    [GKIMUtils loginWithUsername:username password:password block:^(BOOL success) {
        
    }];
}

/*!
 *  自动登陆返回结果
 *
 *  @param aError 错误信息
 */
- (void)didAutoLoginWithError:(EMError *)aError {
    
}

/*!
 *  SDK连接服务器的状态变化时会接收到该回调
 *
 *  有以下几种情况, 会引起该方法的调用:
 *  1. 登录成功后, 手机无法上网时, 会调用该回调
 *  2. 登录成功后, 网络状态变化时, 会调用该回调
 *
 *  @param aConnectionState 当前状态
 */
- (void)didConnectionStateChanged:(EMConnectionState)aConnectionState {
    
}

/*!
 *  当前登录账号在其它设备登录时会接收到该回调
 */
- (void)didLoginFromOtherDevice {
    
}

/*!
 *  当前登录账号已经被从服务器端删除时会收到该回调
 */
- (void)didRemovedFromServer {
    
}

@end
