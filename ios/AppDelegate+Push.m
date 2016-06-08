//
//  AppDelegate+Push.m
//  RNRecruiterProj
//
//  Created by 彭 on 16/5/6.
//  Copyright © 2016年 Gikoo. All rights reserved.
//

#import "AppDelegate+Push.h"
#import "JPUSHService.h"

@implementation AppDelegate (Push)

- (void)initJPushWithOptions:(NSDictionary *)launchOptions {
    if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
        //可以添加自定义categories
        [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                          UIUserNotificationTypeSound |
                                                          UIUserNotificationTypeAlert)
                                              categories:nil];
    } else {
        //categories 必须为nil
        [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                          UIRemoteNotificationTypeSound |
                                                          UIRemoteNotificationTypeAlert)
                                              categories:nil];
    }
    
    [JPUSHService setupWithOption:launchOptions appKey:@"91fb9794d87d7b6044db7095" channel:@"gikoo5 recruiter_rn" apsForProduction:YES];
    
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter addObserver:self
                      selector:@selector(networkDidSetup:)
                          name:kJPFNetworkDidSetupNotification
                        object:nil];
    [defaultCenter addObserver:self
                      selector:@selector(networkDidClose:)
                          name:kJPFNetworkDidCloseNotification
                        object:nil];
    [defaultCenter addObserver:self
                      selector:@selector(networkDidRegister:)
                          name:kJPFNetworkDidRegisterNotification
                        object:nil];
    [defaultCenter addObserver:self
                      selector:@selector(networkDidLogin:)
                          name:kJPFNetworkDidLoginNotification
                        object:nil];
    [defaultCenter addObserver:self
                      selector:@selector(networkDidReceiveMessage:)
                          name:kJPFNetworkDidReceiveMessageNotification
                        object:nil];
    
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken{
    [[EMClient sharedClient] bindDeviceToken:deviceToken];
    
    [JPUSHService registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    [JPUSHService handleRemoteNotification:userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
    [JPUSHService handleRemoteNotification:userInfo];
    completionHandler(UIBackgroundFetchResultNewData);
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error{
    NSLog(@"error: didFailToRegisterForRemoteNotificationsWithError %@",error);
}

- (void)networkDidSetup:(NSNotification *)notification {
    NSLog(@"JPush 建立连接");
}

- (void)networkDidClose:(NSNotification *)notification {
    NSLog(@"JPush 关闭连接");
}

- (void)networkDidRegister:(NSNotification *)notification {
    NSLog(@"JPush 注册成功");
}

- (void)networkDidLogin:(NSNotification *)notification {
    NSLog(@"JPush 登录成功");
}

- (void)networkDidReceiveMessage:(NSNotification *)notification {
    NSLog(@"JPush 收到自定义消息(非APNS)");
}

@end
