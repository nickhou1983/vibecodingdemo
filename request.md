# 手机购买网站 Vue 前端组件结构

## 1. 布局组件 (Layout Components)
- **AppHeader.vue**: 网站顶部导航栏，包含logo、搜索框、登录注册入口、购物车图标
- **AppFooter.vue**: 网站底部，包含联系方式、版权信息、网站导航
- **NavigationMenu.vue**: 导航菜单，可能包括不同品牌、价格区间等分类
- **SideBar.vue**: 侧边栏，用于在产品列表页面显示筛选选项
- **Breadcrumb.vue**: 面包屑导航，显示用户当前位置

## 2. 认证相关组件 (Authentication Components)
- **LoginForm.vue**: 用户登录表单
- **RegisterForm.vue**: 用户注册表单
- **ForgotPassword.vue**: 忘记密码表单
- **ResetPassword.vue**: 重置密码表单
- **AuthModal.vue**: 身份验证模态框，可包含登录/注册表单

## 3. 产品浏览组件 (Product Browsing Components)
- **ProductList.vue**: 产品列表展示
- **ProductCard.vue**: 单个产品卡片，用于产品列表中
- **ProductFilter.vue**: 产品筛选组件，按品牌、价格、特性等
- **ProductSort.vue**: 排序组件，按价格、热度等
- **SearchResults.vue**: 搜索结果展示
- **ProductBanner.vue**: 首页或促销产品展示轮播图
- **CategoryList.vue**: 产品分类列表

## 4. 产品详情组件 (Product Detail Components)
- **ProductDetail.vue**: 产品详情页主组件
- **ProductGallery.vue**: 产品图片展示库
- **ProductSpecifications.vue**: 产品规格参数表
- **ProductDescription.vue**: 产品描述信息
- **ColorSelector.vue**: 颜色选择器
- **StorageSelector.vue**: 存储容量选择器
- **AddToCartButton.vue**: 添加到购物车按钮
- **ProductReviews.vue**: 产品评价列表
- **RelatedProducts.vue**: 相关/推荐产品组件
- **ComparisonChart.vue**: 不同型号对比图表

## 5. 购物车组件 (Shopping Cart Components)
- **ShoppingCart.vue**: 购物车页面主组件
- **CartItem.vue**: 购物车中的单个商品项
- **CartSummary.vue**: 购物车总计和概要
- **CartActions.vue**: 购物车操作按钮（继续购物、去结算）
- **MiniCart.vue**: 迷你购物车，用于顶部导航显示
- **EmptyCart.vue**: 空购物车提示

## 6. 结账组件 (Checkout Components)
- **CheckoutForm.vue**: 结账流程主表单
- **ShippingAddressForm.vue**: 收货地址表单
- **PaymentMethodSelector.vue**: 支付方式选择
- **OrderSummary.vue**: 订单总结和确认
- **OrderSuccess.vue**: 下单成功页面
- **CouponCode.vue**: 优惠码输入框
- **PromotionTag.vue**: 促销标签

## 7. 用户账户组件 (User Account Components)
- **UserProfile.vue**: 用户个人资料展示和编辑
- **OrderHistory.vue**: 历史订单列表
- **OrderDetail.vue**: 单个订单详情
- **AddressList.vue**: 用户保存的地址列表
- **WishList.vue**: 收藏/心愿单功能
- **Notification.vue**: 用户通知组件

## 8. 实用/通用组件 (Utility/Common Components)
- **LoadingSpinner.vue**: 加载中动画
- **Pagination.vue**: 分页控件
- **StarRating.vue**: 星级评分组件
- **Modal.vue**: 通用模态框
- **Toast.vue**: 消息提示组件
- **Button.vue**: 自定义按钮组件
- **ImageSlider.vue**: 图片轮播
- **Accordion.vue**: 手风琴折叠面板
- **Tab.vue**: 标签页组件
- **QuantitySelector.vue**: 数量选择器

## 9. 页面视图 (Views)
- **HomeView.vue**: 首页
- **ProductListView.vue**: 产品列表页
- **ProductDetailView.vue**: 产品详情页
- **CartView.vue**: 购物车页面
- **CheckoutView.vue**: 结账页面
- **AccountView.vue**: 用户账户页面
- **AuthView.vue**: 认证页面
- **NotFoundView.vue**: 404页面
