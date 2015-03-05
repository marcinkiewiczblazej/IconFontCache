#import <UIKit/UIKit.h>
#import "UIButton+IFCImageFont.h"
#import "IFCImageFontCache.h"


@implementation UIButton (IFCImageFont)

- (void)setTitleIcon:(NSString *)titleIcon withSize:(CGFloat)size forState:(UIControlState)state {
    self.titleLabel.font = [UIFont fontWithName:[IFCImageFontCache sharedCache].fontName size:size];
    [self setTitle:titleIcon forState:state];
}

- (void)setImageIcon:(NSString *)titleIcon withSize:(CGFloat)fontSize forState:(UIControlState)state {
    [self setImage:[[IFCImageFontCache sharedCache] imageForIcon:titleIcon size:fontSize] forState:state];
}

@end
