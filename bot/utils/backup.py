
import os
import shutil
from datetime import datetime
from typing import Optional
from utils.logger import logger


BACKUP_DIR = "db/backups"
os.makedirs(BACKUP_DIR, exist_ok=True)


def create_backup(db_path: str, backup_name: Optional[str] = None) -> str:
    """
    Creates a backup of the given database file.
    :param db_path: Path to the SQLite DB file to back up.
    :param backup_name: Optional custom name for the backup file. If None, uses timestamp.
    :return: Path to the created backup file.
    """
    if not os.path.exists(db_path):
        logger.error(f"Database file {db_path} does not exist!")
        raise FileNotFoundError(f"Database file {db_path} not found.")
    
    if backup_name is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        db_name = os.path.basename(db_path)
        backup_name = f"{db_name}.{timestamp}.bak"
    
    backup_path = os.path.join(BACKUP_DIR, backup_name)
    shutil.copy2(db_path, backup_path)
    logger.info(f"Backup created at {backup_path}")
    return backup_path


def restore_backup(backup_path: str, target_db_path: str, overwrite: bool = False) -> None:
    """
    Restores a backup to the target database path.
    :param backup_path: Path to the backup file.
    :param target_db_path: Path where to restore the backup.
    :param overwrite: If True, overwrite existing target file without asking.
    """
    if not os.path.exists(backup_path):
        logger.error(f"Backup file {backup_path} does not exist!")
        raise FileNotFoundError(f"Backup file {backup_path} not found.")
    
    if os.path.exists(target_db_path) and not overwrite:
        logger.error(f"Target DB {target_db_path} already exists! Use overwrite=True.")
        raise FileExistsError(f"Target database already exists at {target_db_path}.")
    
    shutil.copy2(backup_path, target_db_path)
    logger.info(f"Backup restored from {backup_path} to {target_db_path}")


def list_backups(db_name: Optional[str] = None) -> list[str]:
    """
    Lists all backup files, optionally filtered by database name.
    :param db_name: Optional name of the DB to filter backups for (e.g., "anti.db").
    :return: List of backup file paths.
    """
    all_files = os.listdir(BACKUP_DIR)
    if db_name:
        filtered = [f for f in all_files if f.startswith(db_name)]
    else:
        filtered = all_files
    return [os.path.join(BACKUP_DIR, f) for f in filtered]
