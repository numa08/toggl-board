build:
	electron-packager ./ toggl-board --platform=all --arch=x64 --version=0.35.0 --overwrite --out=build --ignore=build
	zip -r build/toggl-board-darwin-x64.zip build/toggl-board-darwin-x64
	zip -r build/toggl-board-linux-x64.zip build/toggl-board-linux-x64
	zip -r build/toggl-board-win32-x64.zip build/toggl-board-win32-x64
	
destribute:
	 @curl -O --user $(BINTRAY_AUTHORICATE) -T "build/toggl-board-darwin-x64.zip" -O  https://api.bintray.com/content/numa08/generic/toggl-board/$(VERSION)/toggl-board-darwin-x64.$(VERSION).zip?publish=1   
	 @curl -O --user $(BINTRAY_AUTHORICATE) -T "build/toggl-board-linux-x64.zip" -O  https://api.bintray.com/content/numa08/generic/toggl-board/$(VERSION)/toggl-board-linux-x64.$(VERSION).zip?publish=1
	 @curl -O --user $(BINTRAY_AUTHORICATE) -T "build/toggl-board-win32-x64.zip" -O  https://api.bintray.com/content/numa08/generic/toggl-board/$(VERSION)/toggl-board-win32-x64.$(VERSION).zip?publish=1
	 
clean:
	@rm -rf build/