#import "UIImageView+IFCImageFont.h"
#import "IFCImageFontCache.h"


@implementation UIImageView (IFCImageFont)

- (void)setIconImage:(NSString *)iconImage withSize:(CGFloat)size {
    [self setImage:[[IFCImageFontCache sharedCache] imageForIcon:iconImage size:size]];
}


@end
