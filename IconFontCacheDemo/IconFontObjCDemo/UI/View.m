#import "View.h"
#import "IFCImageFontCache.h"
#import "NSString+ImageFont.h"


@interface View ()
@property(nonatomic, strong) UIImageView *imageView;
@end

@implementation View {

}

- (instancetype)init {
    self = [super init];
    if (self) {
        self.backgroundColor = [UIColor whiteColor];
        self.imageView = [[UIImageView alloc] initWithImage:[[IFCImageFontCache sharedCache] imageForIcon:[NSString whaleImageFont] size:140]];
        [self addSubview:self.imageView];
    }

    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];

    [self.imageView sizeToFit];
    self.imageView.center = CGPointMake(self.bounds.size.width * 0.5f, self.bounds.size.height * 0.5f);
}


@end
