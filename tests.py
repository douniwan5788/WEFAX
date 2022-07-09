import pytest
import pytest_check as check
import logging
import os

import main

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('my-even-logger')


def check_file_presence(path):
    if os.path.isfile(path):
        logger.info(f'directory "{path}" exist')
        return True
    else:
        logger.error(f'directory "{path}" does not exist')
        return False


def check_directory_presence(path):
    if os.path.isdir(path):
        logger.info(f'directory "{path}" exist')
        return True
    else:
        logger.error(f'directory "{path}" does not exist')
        return False


def test_project_directory_structure():
    directories = ['static', 'templates', 'test_files', 'static/js', 'dummy', 'static/css', 'static/gallery',
                   'static/images',
                   'static/temp']
    for directory in directories:
        check.equal(check_directory_presence(directory), True)


def test_project_files_structure():
    py_files = ['main.py', 'progress_bar.py', 'wefax.py']
    html_files = ['templates/base.html', 'templates/index.html', 'templates/file_converter.html',
                  'templates/live_converter.html', 'templates/gallery.html']
    css_files = ['static/css/file_converter.css', 'static/css/live_converter.css', 'static/css/index.css',
                 'static/css/gallery.css', 'static/css/style.css']
    js_files = ['static/js/convert_file.js', 'static/js/progress_bar.js', 'static/js/upload.js', 'static/js/socketio']

    for file in py_files:
        check.equal(check_file_presence(file), True)

    for file in html_files:
        check.equal(check_file_presence(file), True)

    for file in css_files:
        check.equal(check_file_presence(file), True)

    for file in js_files:
        check.equal(check_file_presence(file), True)


def launch_server():
    main.start_server()


if __name__ == '__main__':
    logger.info(' About to start the tests ')
    pytest.main(args=[os.path.abspath(__file__), '--html=report.html', '--self-contained-html', '--color=yes',
                      '--show-capture=log'])
    logger.info(' Done executing the tests ')
