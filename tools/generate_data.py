from bs4 import BeautifulSoup
import requests
import re

url = "https://raw.githubusercontent.com/Vector35/community-plugins/refs/heads/master/README.md"
response = requests.get(url)

if response.status_code != 200:
    print(f"Failed to retrieve content from {url}")
    exit()

content = response.text

pattern = r'\|(\[.*?\]\(.*?\))\|(\[.*?\]\(.*?\))\|(.*?)\|(\d{4}-\d{2}-\d{2})\|(.*?)\|(.*?)\|'
matches = re.findall(pattern, content)

def fetch_language_from_github(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        language_list = soup.select('a.Link--secondary > span')
        
        for language in language_list:
            lang = language.text.strip().lower()
            if lang in ["python", "rust", "c", "c++"]:
                return lang
    return "unknown"

def format_date(date_string):
    return date_string.replace("-", "")

def escape_js_string(s):
    return s.replace('\\', '\\\\').replace('"', '\\"').replace("'", "\\'").replace("\n", "\\n")

js_data = "var tabledata = [\n"
for match in matches:
    plugin_name_link = match[0]  # Plugin name with link
    author_link = match[1]  # Author name with link
    description = escape_js_string(match[2].strip())  # Description (escaped)
    last_updated = format_date(match[3])  # Last Updated date
    plugin_type = escape_js_string(match[4].strip())  # Type of plugin (escaped)
    license_type = escape_js_string(match[5].strip())  # License (escaped)

    name_match = re.match(r'\[(.*?)\]\((.*?)\)', plugin_name_link)
    if name_match:
        plugin_name = escape_js_string(name_match.group(1))
        plugin_url = escape_js_string(name_match.group(2))

    author_match = re.match(r'\[(.*?)\]\((.*?)\)', author_link)
    if author_match:
        author_name = escape_js_string(author_match.group(1))
        author_url = escape_js_string(author_match.group(2))

    language = fetch_language_from_github(plugin_url)

    tags = ', '.join([f'"{escape_js_string(tag.strip())}"' for tag in plugin_type.split(',')])

    js_data += f'{{name: "{plugin_name}", url: "{plugin_url}", author: "{author_name}", author_url: "{author_url}", desc: "{description}", last: "{last_updated}", tags: [{tags}], src: "{language}"}},\n'

js_data += "];"


with open("../src/data.js", "w") as file:
    file.write(js_data)

print("Data has been successfully written to generated_data.js")
