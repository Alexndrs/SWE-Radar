"""
Internship Hunter MVP - Job Scraping System
Target: FAANG + Top Tech Companies
Focus: Summer 2026 Software Engineering Internships
"""

import asyncio
import aiohttp
import hashlib
import json
import logging
import smtplib
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Optional, Set
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import sqlite3
import schedule
import time

# Configuration
@dataclass
class Config:
    # Email settings
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    EMAIL_USER = "your-email@gmail.com"
    EMAIL_PASS = "your-app-password"  # Use app password for Gmail
    NOTIFICATION_EMAIL = "your-email@gmail.com"
    
    # Job filtering
    TARGET_KEYWORDS = [
        "summer internship", "summer intern", "software engineer intern",
        "frontend intern", "backend intern", "fullstack intern",
        "software development intern", "engineering intern"
    ]
    
    LOCATIONS = [
        "paris", "montreal", "toronto", "vancouver", "canada",
        "remote", "visa sponsorship", "h1b", "united states"
    ]
    
    # Companies
    DREAM_COMPANIES = {
        "Google": "https://careers.google.com/jobs/results/",
        "Meta": "https://www.metacareers.com/jobs/",
        "Amazon": "https://amazon.jobs/en/search",
        "Microsoft": "https://careers.microsoft.com/us/en/search-results",
        "Apple": "https://jobs.apple.com/en-us/search",
        "Netflix": "https://jobs.netflix.com/search",
        "Shopify": "https://www.shopify.com/careers/search"
    }

@dataclass
class Job:
    id: str
    title: str
    company: str
    location: str
    url: str
    description: str
    posted_date: datetime
    discovered_date: datetime
    
    def to_dict(self):
        return {
            **asdict(self),
            'posted_date': self.posted_date.isoformat(),
            'discovered_date': self.discovered_date.isoformat()
        }

class DatabaseManager:
    def __init__(self, db_path: str = "internships.db"):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY,
                title TEXT,
                company TEXT,
                location TEXT,
                url TEXT,
                description TEXT,
                posted_date TEXT,
                discovered_date TEXT,
                notified BOOLEAN DEFAULT FALSE
            )
        """)
        conn.commit()
        conn.close()
    
    def job_exists(self, job_id: str) -> bool:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute("SELECT 1 FROM jobs WHERE id = ?", (job_id,))
        exists = cursor.fetchone() is not None
        conn.close()
        return exists
    
    def save_job(self, job: Job):
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            INSERT OR REPLACE INTO jobs 
            (id, title, company, location, url, description, posted_date, discovered_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            job.id, job.title, job.company, job.location, 
            job.url, job.description, 
            job.posted_date.isoformat(), 
            job.discovered_date.isoformat()
        ))
        conn.commit()
        conn.close()
    
    def get_unnotified_jobs(self) -> List[Job]:
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute("""
            SELECT id, title, company, location, url, description, posted_date, discovered_date
            FROM jobs WHERE notified = FALSE
        """)
        jobs = []
        for row in cursor.fetchall():
            job = Job(
                id=row[0], title=row[1], company=row[2], location=row[3],
                url=row[4], description=row[5],
                posted_date=datetime.fromisoformat(row[6]),
                discovered_date=datetime.fromisoformat(row[7])
            )
            jobs.append(job)
        conn.close()
        return jobs
    
    def mark_as_notified(self, job_id: str):
        conn = sqlite3.connect(self.db_path)
        conn.execute("UPDATE jobs SET notified = TRUE WHERE id = ?", (job_id,))
        conn.commit()
        conn.close()

class BaseScraper:
    def __init__(self, company_name: str, base_url: str):
        self.company_name = company_name
        self.base_url = base_url
        self.config = Config()
    
    def generate_job_id(self, title: str, company: str, url: str) -> str:
        """Generate unique ID for job posting"""
        unique_string = f"{title}_{company}_{url}"
        return hashlib.md5(unique_string.encode()).hexdigest()
    
    def is_relevant_job(self, title: str, description: str, location: str) -> bool:
        """Check if job matches our criteria"""
        text_to_search = f"{title} {description} {location}".lower()
        
        # Must contain internship keywords
        has_internship = any(keyword in text_to_search for keyword in self.config.TARGET_KEYWORDS)
        
        # Must be in target location or remote/visa
        has_location = any(loc in text_to_search for loc in self.config.LOCATIONS)
        
        # Filter out non-2026 internships (common issue)
        if "2025" in text_to_search and "2026" not in text_to_search:
            return False
            
        return has_internship and has_location
    
    async def scrape_jobs(self) -> List[Job]:
        """Override this method in specific scrapers"""
        raise NotImplementedError

class GoogleScraper(BaseScraper):
    def __init__(self):
        super().__init__("Google", "https://careers.google.com/jobs/results/")
    
    async def scrape_jobs(self) -> List[Job]:
        """Scrape Google Careers using Selenium with stealth"""
        jobs = []
        
        # Enhanced stealth options
        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-plugins")
        chrome_options.add_argument("--disable-images")
        chrome_options.add_argument("--disable-javascript")  # Try without JS first
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        driver = webdriver.Chrome(options=chrome_options)
        
        # Remove webdriver property
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        try:
            # Start with simple search page
            search_url = "https://careers.google.com/jobs/results/?q=intern"
            logging.info(f"Navigating to: {search_url}")
            driver.get(search_url)
            
            # Wait a bit for page load
            time.sleep(3)
            
            # Take screenshot for debugging
            driver.save_screenshot("google_page.png")
            logging.info("Screenshot saved as google_page.png")
            
            # Try multiple selectors
            possible_selectors = [
                ".gc-job-tags",
                "[data-job-id]",
                ".job-tile",
                "article",
                "[role='article']"
            ]
            
            job_elements = []
            for selector in possible_selectors:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        logging.info(f"Found {len(elements)} elements with selector: {selector}")
                        job_elements = elements
                        break
                except:
                    continue
            
            if not job_elements:
                # Fallback: get all text and check for jobs
                page_text = driver.page_source
                logging.info(f"Page source length: {len(page_text)}")
                
                # Save page source for debugging
                with open("google_page_source.html", "w", encoding="utf-8") as f:
                    f.write(page_text)
                logging.info("Page source saved as google_page_source.html")
                
                # Simple text-based detection
                if "intern" in page_text.lower() and "software" in page_text.lower():
                    # Create a dummy job for testing
                    job = Job(
                        id=self.generate_job_id("Software Engineering Intern", self.company_name, search_url),
                        title="Software Engineering Intern (Found in page)",
                        company=self.company_name,
                        location="Multiple locations",
                        url=search_url,
                        description="Job detected in page text but couldn't parse details",
                        posted_date=datetime.now(),
                        discovered_date=datetime.now()
                    )
                    jobs.append(job)
                    logging.info("Created test job based on page content")
            
            # Process found elements
            for i, job_element in enumerate(job_elements[:5]):  # Limit to 5 for testing
                try:
                    element_text = job_element.text.strip()
                    if element_text and len(element_text) > 10:
                        logging.info(f"Job element {i}: {element_text[:100]}...")
                        
                        # Try to find links
                        links = job_element.find_elements(By.TAG_NAME, "a")
                        job_url = links[0].get_attribute("href") if links else search_url
                        
                        # Extract title (first line usually)
                        title_lines = element_text.split('\n')
                        title = title_lines[0] if title_lines else "Software Engineering Position"
                        
                        if self.is_relevant_job(title, element_text, ""):
                            job_id = self.generate_job_id(title, self.company_name, job_url)
                            
                            job = Job(
                                id=job_id,
                                title=title,
                                company=self.company_name,
                                location="Location TBD",
                                url=job_url,
                                description=element_text[:500],
                                posted_date=datetime.now(),
                                discovered_date=datetime.now()
                            )
                            jobs.append(job)
                            logging.info(f"Added job: {title}")
                        
                except Exception as e:
                    logging.warning(f"Error parsing job element {i}: {e}")
                    continue
                    
        except Exception as e:
            logging.error(f"Error scraping Google: {e}")
            # Save screenshot on error
            try:
                driver.save_screenshot("google_error.png")
                logging.info("Error screenshot saved as google_error.png")
            except:
                pass
        finally:
            driver.quit()
        
        return jobs

class LeverScraper(BaseScraper):
    """Generic scraper for companies using Lever platform"""
    
    def __init__(self, company_name: str, lever_url: str):
        super().__init__(company_name, lever_url)
    
    async def scrape_jobs(self) -> List[Job]:
        """Scrape Lever-based careers pages"""
        jobs = []
        
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get(self.base_url) as response:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    # Lever has consistent structure
                    job_listings = soup.find_all('div', class_='posting')
                    
                    for posting in job_listings:
                        try:
                            title_elem = posting.find('h5')
                            title = title_elem.text.strip() if title_elem else ""
                            
                            location_elem = posting.find('span', class_='sort-by-location')
                            location = location_elem.text.strip() if location_elem else ""
                            
                            link_elem = posting.find('a')
                            job_url = link_elem.get('href') if link_elem else ""
                            if job_url.startswith('/'):
                                job_url = f"https://jobs.lever.co{job_url}"
                            
                            description = posting.text.strip()
                            
                            if self.is_relevant_job(title, description, location):
                                job_id = self.generate_job_id(title, self.company_name, job_url)
                                
                                job = Job(
                                    id=job_id,
                                    title=title,
                                    company=self.company_name,
                                    location=location,
                                    url=job_url,
                                    description=description[:500],
                                    posted_date=datetime.now(),
                                    discovered_date=datetime.now()
                                )
                                jobs.append(job)
                                
                        except Exception as e:
                            logging.warning(f"Error parsing Lever job: {e}")
                            continue
                            
            except Exception as e:
                logging.error(f"Error scraping {self.company_name}: {e}")
        
        return jobs

class NotificationManager:
    def __init__(self, config: Config):
        self.config = config
    
    def send_email_notification(self, jobs: List[Job]):
        """Send email notification for new jobs"""
        if not jobs:
            return
        
        try:
            msg = MIMEMultipart()
            msg['From'] = self.config.EMAIL_USER
            msg['To'] = self.config.NOTIFICATION_EMAIL
            msg['Subject'] = f"🚨 {len(jobs)} New Internship{'s' if len(jobs) > 1 else ''} Found!"
            
            # Create HTML email body
            html_body = """
            <html>
            <body>
            <h2>New Internship Opportunities!</h2>
            """
            
            for job in jobs:
                html_body += f"""
                <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0;">
                    <h3><a href="{job.url}">{job.title}</a></h3>
                    <p><strong>Company:</strong> {job.company}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Discovered:</strong> {job.discovered_date.strftime('%Y-%m-%d %H:%M')}</p>
                    <p><strong>Description:</strong> {job.description[:200]}...</p>
                    <p><a href="{job.url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Apply Now</a></p>
                </div>
                """
            
            html_body += """
            </body>
            </html>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            # Send email
            with smtplib.SMTP(self.config.SMTP_SERVER, self.config.SMTP_PORT) as server:
                server.starttls()
                server.login(self.config.EMAIL_USER, self.config.EMAIL_PASS)
                server.send_message(msg)
            
            logging.info(f"Email notification sent for {len(jobs)} jobs")
            
        except Exception as e:
            logging.error(f"Failed to send email notification: {e}")

class InternshipHunter:
    def __init__(self):
        self.config = Config()
        self.db = DatabaseManager()
        self.notifier = NotificationManager(self.config)
        
        # Initialize scrapers
        self.scrapers = [
            GoogleScraper(),
            # Add more scrapers as you find Lever-based companies
            # LeverScraper("Shopify", "https://jobs.lever.co/shopify"),
        ]
    
    async def run_scraping_cycle(self):
        """Run one complete scraping cycle"""
        logging.info("Starting scraping cycle...")
        all_new_jobs = []
        
        for scraper in self.scrapers:
            try:
                logging.info(f"Scraping {scraper.company_name}...")
                jobs = await scraper.scrape_jobs()
                
                # Filter out jobs we've already seen
                new_jobs = [job for job in jobs if not self.db.job_exists(job.id)]
                
                # Save new jobs to database
                for job in new_jobs:
                    self.db.save_job(job)
                    all_new_jobs.append(job)
                
                logging.info(f"Found {len(new_jobs)} new jobs from {scraper.company_name}")
                
            except Exception as e:
                logging.error(f"Error scraping {scraper.company_name}: {e}")
        
        # Send notifications for all new jobs
        if all_new_jobs:
            self.notifier.send_email_notification(all_new_jobs)
            
            # Mark jobs as notified
            for job in all_new_jobs:
                self.db.mark_as_notified(job.id)
        
        logging.info(f"Scraping cycle completed. Found {len(all_new_jobs)} new jobs total.")
    
    def start_monitoring(self):
        """Start the monitoring system"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('internship_hunter.log'),
                logging.StreamHandler()
            ]
        )
        
        logging.info("Internship Hunter started!")
        
        # Schedule scraping every hour during peak posting times
        schedule.every().hour.at(":00").do(lambda: asyncio.run(self.run_scraping_cycle()))
        
        # Run initial scraping
        asyncio.run(self.run_scraping_cycle())
        
        # Keep the scheduler running
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute

if __name__ == "__main__":
    hunter = InternshipHunter()
    hunter.start_monitoring()