//
//  EMMessage+Ext.m
//  Gikoo5
//
//  Created by 彭 on 16/3/22.
//  Copyright © 2016年 gikoo. All rights reserved.
//

#import "EMMessage+Ext.h"

@implementation EMMessage (Ext)

- (BOOL)isSender {
    return self.direction == EMMessageDirectionSend;
}

- (BOOL)isRobotHistoryMessage {
    NSDictionary* ext = self.ext;
    
    if (!ext) {
        return NO;
    }
    
    NSNumber* robot = ext[@"extend_attr_robot"];
    
    if (!robot) {
        return NO;
    }
    
    return robot.boolValue;
}

- (NSDictionary*)lastRobotHistoryDictionary {
    if (![self isRobotHistoryMessage]) {
        return nil;
    }
    
    NSDictionary* ext = self.ext;
    
    if (!ext) {
        return nil;
    }
    
    NSDictionary* robotContent = ext[@"extend_attr_robot_content"];
    
    if (robotContent) {
        return robotContent;
    }
    
    if (![self.body isKindOfClass:[EMTextMessageBody class]]) {
        return nil;
    }
    
    EMTextMessageBody* textBody = (EMTextMessageBody*)self.body;
    
    if (!textBody) {
        return nil;
    }
    
    NSData *jsonData = [textBody.text dataUsingEncoding:NSUTF8StringEncoding];
    
    if (!jsonData) {
        return nil;
    }
    
    return [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingMutableContainers error:nil];
}

- (NSString*)lastRobotHistoryMessageText {
    NSDictionary *jsonDict = [self lastRobotHistoryDictionary];
    
    if (jsonDict) {
        NSArray* detail = jsonDict[@"detail"];
        
        if (detail && detail.count) {
            NSDictionary* lastMessage = detail.lastObject;
            
            return lastMessage[@"msg_content"];
        }
    }
    
    return @"";
}

- (BOOL)isRobotBeginMessage {
    NSDictionary* ext = self.ext;
    
    if (!ext) {
        return NO;
    }
    
    NSNumber* begin = ext[@"extend_attr_robot_begin"];
    
    if (!begin) {
        return NO;
    }
    
    return begin.intValue == 1;
    
}

- (BOOL)isRobotEndMessage {
    NSDictionary* ext = self.ext;
    
    if (!ext) {
        return NO;
    }
    
    NSNumber* end = ext[@"extend_attr_robot_end"];
    
    if (!end) {
        return NO;
    }
    
    return end.intValue == 1;
}

@end
