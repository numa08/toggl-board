build:
	npm run build
	zip -q -r build/toggl-board-darwin-x64.zip build/toggl-board-darwin-x64
	zip -q -r build/toggl-board-linux-x64.zip build/toggl-board-linux-x64
	zip -q -r build/toggl-board-win32-x64.zip build/toggl-board-win32-x64
	
destribute:
	 @curl -O --user $(BINTRAY_AUTHORICATE) -T "build/toggl-board-darwin-x64.zip" -O  https://api.bintray.com/content/numa08/generic/toggl-board/$(VERSION)/toggl-board-darwin-x64.$(VERSION).zip?publish=1   
	 @curl -O --user $(BINTRAY_AUTHORICATE) -T "build/toggl-board-linux-x64.zip" -O  https://api.bintray.com/content/numa08/generic/toggl-board/$(VERSION)/toggl-board-linux-x64.$(VERSION).zip?publish=1
	 @curl -O --user $(BINTRAY_AUTHORICATE) -T "build/toggl-board-win32-x64.zip" -O  https://api.bintray.com/content/numa08/generic/toggl-board/$(VERSION)/toggl-board-win32-x64.$(VERSION).zip?publish=1
	 
clean:
	@rm -rf build/