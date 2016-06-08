//
//  ARCSingletonTemplate.h
//  XunKaiXin
//
//  Created by pengbeicn on 13-7-6.
//  Copyright (c) 2013年 pengbeicn. All rights reserved.
//

#ifndef XunKaiXin_ARCSingletonTemplate_h
#define XunKaiXin_ARCSingletonTemplate_h

#define SYNTHESIZE_SINGLETON_FOR_HEADER(className) \
\
+ (className *)shared##className;

#define SYNTHESIZE_SINGLETON_FOR_CLASS(className) \
\
+ (className *)shared##className { \
static className *shared##className = nil; \
static dispatch_once_t onceToken; \
dispatch_once(&onceToken, ^{ \
shared##className = [[self alloc] init]; \
}); \
return shared##className; \
}

#endif
