import os
import yaml
from tqdm import tqdm
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import xml.etree.ElementTree as ET

# Define table names
CHARACTER_TABLE_NAME     =  'chuni_static_characters'
NAMEPLATE_TABLE_NAME     =  'chuni_static_nameplate'
SYSTEMVOICE_TABLE_NAME   =  'chuni_static_systemvoice'
TROPHY_TABLE_NAME        =  'chuni_static_trophies'
MAPICON_TABLE_NAME       =  'chuni_static_mapicon'
DAPHNIS_RIVAL_TABLE_NAME =  'chuni_rival_codes'

def read_config():
    with open("/home/polaris/projects/sega/artemis/config/core.yaml", 'r') as file:
        return yaml.safe_load(file)

def create_db_engine(db_config):
    try:
        url = f"mysql+mysqldb://{db_config['username']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['daphnis']}"
        engine = create_engine(url)
        return engine
    except SQLAlchemyError as e:
        print(f"Error connecting to MySQL database: {e}")
        return None



def parse_chara_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    return {
        'id': int(root.find("name/id").text),
        'dataName': root.find('dataName').text,
        'name': root.find('name/str').text,
        'defaultImages': root.find('defaultImages/str').text,
        'sortName': root.find('sortName').text,
        'works': root.find('works/str').text,
        'netOpenName': root.find('netOpenName/str').text,
        'rareType': root.find('rareType').text,
    }

def parse_nameplate_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    return {
        "id": int(root.find("name/id").text),
        'dataName': root.find('dataName').text,
        'netOpenName': root.find('netOpenName/str').text,
        'name': root.find('name/str').text,
        'sortName': root.find('sortName').text,
        'imagePath': root.find('image/path').text,
    }

def parse_systemvoice_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    return {
        "id": int(root.find("name/id").text),
        'dataName': root.find('dataName').text,
        'name': root.find('name/str').text,
        'sortName': root.find('sortName').text,
        'imagePath': root.find('image/path').text,
    }

def parse_trophy_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    return {
        "id": int(root.find("name/id").text),
        'dataName': root.find('dataName').text,
        'netOpenName': root.find('netOpenName/str').text,
        'name': root.find('name/str').text,
        'rareType': root.find('rareType').text,
    }


def parse_mapicon_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    return {
        "id": int(root.find("name/id").text),
        'dataName': root.find('dataName').text,
        'name': root.find('name/str').text,
        'sortName': root.find('sortName').text,
        'imagePath': root.find('image/path').text,
    }

def ensure_tables(engine):
    tables = {
        CHARACTER_TABLE_NAME: f"""
            CREATE TABLE IF NOT EXISTS {CHARACTER_TABLE_NAME} (
                id INT PRIMARY KEY,
                str VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                imagePath VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                sortName VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                category VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                netOpenName VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                rareType VARCHAR(255) COLLATE utf8mb4_unicode_ci
            ) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """,

        NAMEPLATE_TABLE_NAME: f"""
            CREATE TABLE IF NOT EXISTS {NAMEPLATE_TABLE_NAME} (
                id INT PRIMARY KEY,
                str VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                imagePath VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                sortName VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                netOpenName VARCHAR(255) COLLATE utf8mb4_unicode_ci
            ) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """,
        SYSTEMVOICE_TABLE_NAME: f"""
            CREATE TABLE IF NOT EXISTS {SYSTEMVOICE_TABLE_NAME} (
                id INT PRIMARY KEY,
                str VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                imagePath VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                sortName VARCHAR(255) COLLATE utf8mb4_unicode_ci
            ) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """,
        TROPHY_TABLE_NAME: f"""
            CREATE TABLE IF NOT EXISTS {TROPHY_TABLE_NAME} (
                id INT PRIMARY KEY,
                str VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                rareType VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                netOpenName VARCHAR(255) COLLATE utf8mb4_unicode_ci
            ) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """,
        MAPICON_TABLE_NAME: f"""
            CREATE TABLE IF NOT EXISTS {MAPICON_TABLE_NAME} (
                id INT PRIMARY KEY,
                str VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                imagePath VARCHAR(255) COLLATE utf8mb4_unicode_ci,
                sortName VARCHAR(255) COLLATE utf8mb4_unicode_ci
            ) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """,
           DAPHNIS_RIVAL_TABLE_NAME: f"""
            CREATE TABLE IF NOT EXISTS {DAPHNIS_RIVAL_TABLE_NAME} (
                id INT PRIMARY KEY,
                rivalCode VARCHAR(255) COLLATE utf8mb4_unicode_ci
            ) CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
    }

    with engine.connect() as connection:
        with connection.begin():
            for table_name, create_table_sql in tables.items():
                result = connection.execute(text(f"SHOW TABLES LIKE '{table_name}'"))
                if not result.fetchone():
                    print(f"'{table_name}' table doesn't exist. Creating it now.")
                    connection.execute(text(create_table_sql))
                    print(f"'{table_name}' table created successfully!")
                else:
                    print(f"'{table_name}' table already exists.")

def insert_chara_data(engine, data):
    with engine.connect() as connection:
        with connection.begin():
            connection.execute(text(f"""
                DELETE FROM {CHARACTER_TABLE_NAME} WHERE id = :id
            """), {"id": data['id']})

            connection.execute(text(f"""
                INSERT INTO {CHARACTER_TABLE_NAME} (id, str, imagePath, sortName, category, netOpenName, rareType)
                VALUES (:id, :name, :defaultImages, :sortName, :works, :netOpenName, :rareType)
            """), data)

def insert_nameplate_data(engine, data):
    with engine.connect() as connection:
        with connection.begin():
            connection.execute(text(f"""
                DELETE FROM {NAMEPLATE_TABLE_NAME} WHERE id = :id
            """), {"id": data['id']})

            connection.execute(text(f"""
                INSERT INTO {NAMEPLATE_TABLE_NAME} (id, str, imagePath, sortName, netOpenName)
                VALUES (:id, :name, :imagePath, :sortName, :netOpenName)
            """), data)

def insert_systemvoice_data(engine, data):
    with engine.connect() as connection:
        with connection.begin():
            connection.execute(text(f"""
                DELETE FROM {SYSTEMVOICE_TABLE_NAME} WHERE id = :id
            """), {"id": data['id']})

            connection.execute(text(f"""
                INSERT INTO {SYSTEMVOICE_TABLE_NAME} (id, str, imagePath, sortName)
                VALUES (:id, :name, :imagePath, :sortName)
            """), data)


def insert_trophy_data(engine, data):
    with engine.connect() as connection:
        with connection.begin():
            connection.execute(text(f"""
                DELETE FROM {TROPHY_TABLE_NAME} WHERE id = :id
            """), {"id": data['id']})

            connection.execute(text(f"""
                INSERT INTO {TROPHY_TABLE_NAME} (id, str, rareType, netOpenName)
                VALUES (:id, :name, :rareType, :netOpenName)
            """), data)

def insert_mapicon_data(engine, data):
    with engine.connect() as connection:
        with connection.begin():
            connection.execute(text(f"""
                DELETE FROM {MAPICON_TABLE_NAME} WHERE id = :id
            """), {"id": data['id']})

            connection.execute(text(f"""
                INSERT INTO {MAPICON_TABLE_NAME} (id, str, imagePath, sortName)
                VALUES (:id, :name, :imagePath, :sortName)
            """), data)

def insert_cozynet_rival_data(engine, data):
    with engine.connect() as connection:
        with connection.begin():
            connection.execute(text(f"""
                DELETE FROM {DAPHNIS_RIVAL_TABLE_NAME} WHERE id = :id
            """), {"id": data['id']})

            connection.execute(text(f"""
                INSERT INTO {DAPHNIS_RIVAL_TABLE_NAME} (id, rivalCode)
                VALUES (:id, :rivalCode)
            """), data)
def main():
    config = read_config()
    engine = create_db_engine(config['database'])
    if not engine:
        return

    ensure_tables(engine)

    rootDir = "/home/polaris/Documents/Chunithm Luminous Plus English"
    filesToSearch = {"Chara.xml", "NamePlate.xml", "SystemVoice.xml", "Trophy.xml", "MapIcon.xml"}

    GREEN = '\033[92m'
    RESET = '\033[0m'

    bar_format = f'{GREEN}{{desc}}{GREEN}|{{bar}}{GREEN}|{RESET} {{n_fmt}}/{{total_fmt}} [{{elapsed}}<{{remaining}}, {{postfix}}]'

    fileSet = set()

    for relativePath, dirs, files in os.walk(rootDir):
        for file in files:
            if file in filesToSearch:
                fullPath = os.path.join(rootDir, relativePath, file)
                fileSet.add((file, fullPath))

    with tqdm(total=len(fileSet), desc="Building database tables", unit="file", bar_format=bar_format, colour='green') as pbar:
        for file, fullPath in fileSet:
            if file == "Chara.xml":
                chara_data = parse_chara_xml(fullPath)
                insert_chara_data(engine, chara_data)
            elif file == "NamePlate.xml":
                nameplate_data = parse_nameplate_xml(fullPath)
                insert_nameplate_data(engine, nameplate_data)
            elif file == "SystemVoice.xml":
                systemvoice_data = parse_systemvoice_xml(fullPath)
                insert_systemvoice_data(engine, systemvoice_data)
            elif file == "Trophy.xml":
                trophy_data = parse_trophy_xml(fullPath)
                insert_trophy_data(engine, trophy_data)
            elif file == "MapIcon.xml":
                mapicon_data = parse_mapicon_xml(fullPath)
                insert_mapicon_data(engine, mapicon_data)
            pbar.update(1)

    engine.dispose()

if __name__ == "__main__":
    main()
