#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface UIButton (IFCImageFont)

- (void)setTitleIcon:(NSString *)titleIcon withSize:(CGFloat)size forState:(UIControlState)state;

- (void)setImageIcon:(NSString *)titleIcon withSize:(CGFloat)fontSize forState:(UIControlState)state;

@end
