1. 下载 Chrome组策略管理模板“chrome.adm”（下载地址）；
2. Win+R 打开运行，输入 gpedit.msc，确定；
3. 依次展开 本地计算机策略 > 计算机配置 > 管理模板，在“管理模板”上右击，选择“添加/删除模板”；

4. 点击添加，找到第1步下载的“chrome.adm”，打开，关闭“添加/删除模板”窗口；
5. 依次展开 本地计算机策略 > 计算机配置 > 管理模板 > 经典管理模板(ADM) > Google > Google Chrome > 扩展程序，双击右侧的“配置扩展程序安装白名单”；

6. 点选左边第二项“已启用”，点击下面的“显示”，

7. 打开 Chrome，将下载的 .crx 文件拖放至 Chrome 扩展程序页面安装；
8. 找到右上角的“开发者模式”，勾选，复制刚安装的扩展的 ID；

9. 粘贴到第6步弹出的窗口中，确定；



转自http://www.itechzero.com/technology/pieces/windows/prevent-chrome-shielding-unofficial-extensions-tutorial/