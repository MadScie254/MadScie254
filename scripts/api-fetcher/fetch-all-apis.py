#!/usr/bin/env python3
"""
Comprehensive API Data Fetcher for Daniel Wanjala Portfolio
Fetches data from multiple APIs and caches as JSON snapshots
"""

import json
import requests
import time
import os
from datetime import datetime, timedelta
import feedparser
from urllib.parse import quote
import logging
import sys

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class APIDataFetcher:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Daniel-Wanjala-Portfolio/2.0 (https://madscie254.github.io/MadScie254/)'
        })
        self.output_dir = 'assets/api-snapshots'
        self.ensure_output_dir()
        
        # API endpoints and configurations
        self.apis = {
            'github': {
                'enabled': True,
                'cache_duration': 3600,  # 1 hour
                'fetcher': self.fetch_github_data
            },
            'news': {
                'enabled': True,
                'cache_duration': 7200,  # 2 hours
                'fetcher': self.fetch_news_data
            },
            'weather': {
                'enabled': True,
                'cache_duration': 1800,  # 30 minutes
                'fetcher': self.fetch_weather_data
            },
            'crypto': {
                'enabled': True,
                'cache_duration': 900,   # 15 minutes
                'fetcher': self.fetch_crypto_data
            },
            'quotes': {
                'enabled': True,
                'cache_duration': 86400, # 24 hours
                'fetcher': self.fetch_quotes_data
            },
            'wikipedia': {
                'enabled': True,
                'cache_duration': 86400, # 24 hours
                'fetcher': self.fetch_wikipedia_data
            },
            'time': {
                'enabled': True,
                'cache_duration': 300,   # 5 minutes
                'fetcher': self.fetch_time_data
            },
            'hackernews': {
                'enabled': True,
                'cache_duration': 1800,  # 30 minutes
                'fetcher': self.fetch_hackernews_data
            }
        }
        
    def ensure_output_dir(self):
        os.makedirs(self.output_dir, exist_ok=True)
        
    def save_json(self, data, filename):
        """Save data as JSON with metadata"""
        filepath = os.path.join(self.output_dir, filename)
        
        # Add metadata
        enhanced_data = {
            'data': data,
            'metadata': {
                'fetched_at': datetime.now().isoformat(),
                'expires_at': (datetime.now() + timedelta(hours=2)).isoformat(),
                'source': 'api-prefetch-pipeline',
                'version': '2.0'
            }
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(enhanced_data, f, indent=2, ensure_ascii=False)
            
        logger.info(f"Saved {filename} ({len(json.dumps(data))} bytes)")
        
    def fetch_github_data(self):
        """Fetch comprehensive GitHub profile and repository data"""
        try:
            username = 'MadScie254'
            
            # User profile
            user_response = self.session.get(f'https://api.github.com/users/{username}')
            user_response.raise_for_status()
            user_data = user_response.json()
            
            # Repositories
            repos_response = self.session.get(
                f'https://api.github.com/users/{username}/repos',
                params={'sort': 'updated', 'per_page': 20}
            )
            repos_response.raise_for_status()
            repos_data = repos_response.json()
            
            # Events (activity)
            events_response = self.session.get(
                f'https://api.github.com/users/{username}/events/public',
                params={'per_page': 10}
            )
            events_response.raise_for_status()
            events_data = events_response.json()
            
            # Organizations
            orgs_response = self.session.get(f'https://api.github.com/users/{username}/orgs')
            orgs_response.raise_for_status()
            orgs_data = orgs_response.json()
            
            # Process repositories for enhanced data
            enhanced_repos = []
            for repo in repos_data[:10]:  # Top 10 repos
                repo_detail = {
                    'name': repo['name'],
                    'full_name': repo['full_name'],
                    'description': repo['description'],
                    'html_url': repo['html_url'],
                    'language': repo['language'],
                    'stargazers_count': repo['stargazers_count'],
                    'forks_count': repo['forks_count'],
                    'open_issues_count': repo['open_issues_count'],
                    'created_at': repo['created_at'],
                    'updated_at': repo['updated_at'],
                    'pushed_at': repo['pushed_at'],
                    'size': repo['size'],
                    'topics': repo.get('topics', []),
                    'license': repo.get('license', {}).get('name') if repo.get('license') else None,
                    'default_branch': repo['default_branch'],
                    'archived': repo['archived'],
                    'disabled': repo['disabled'],
                    'fork': repo['fork']
                }
                
                # Get README if available
                try:
                    readme_response = self.session.get(
                        f'https://api.github.com/repos/{repo["full_name"]}/readme'
                    )
                    if readme_response.status_code == 200:
                        readme_data = readme_response.json()
                        repo_detail['readme_available'] = True
                        repo_detail['readme_size'] = readme_data.get('size', 0)
                    else:
                        repo_detail['readme_available'] = False
                except:
                    repo_detail['readme_available'] = False
                    
                enhanced_repos.append(repo_detail)
                
            # Build comprehensive GitHub data
            github_data = {
                'profile': {
                    'login': user_data['login'],
                    'name': user_data['name'],
                    'bio': user_data['bio'],
                    'avatar_url': user_data['avatar_url'],
                    'html_url': user_data['html_url'],
                    'blog': user_data['blog'],
                    'location': user_data['location'],
                    'email': user_data['email'],
                    'twitter_username': user_data['twitter_username'],
                    'company': user_data['company'],
                    'public_repos': user_data['public_repos'],
                    'public_gists': user_data['public_gists'],
                    'followers': user_data['followers'],
                    'following': user_data['following'],
                    'created_at': user_data['created_at'],
                    'updated_at': user_data['updated_at']
                },
                'repositories': enhanced_repos,
                'recent_activity': events_data[:10],
                'organizations': orgs_data,
                'statistics': {
                    'total_repositories': len(repos_data),
                    'languages': list(set([repo['language'] for repo in repos_data if repo['language']])),
                    'total_stars': sum([repo['stargazers_count'] for repo in repos_data]),
                    'total_forks': sum([repo['forks_count'] for repo in repos_data]),
                    'most_starred_repo': max(repos_data, key=lambda x: x['stargazers_count'], default={}),
                    'most_recent_repo': max(repos_data, key=lambda x: x['updated_at'], default={})
                }
            }
            
            self.save_json(github_data, 'github-profile.json')
            return True
            
        except Exception as e:
            logger.error(f"Failed to fetch GitHub data: {e}")
            return False
            
    def fetch_news_data(self):
        """Fetch technology news from multiple sources"""
        try:
            all_articles = []
            
            # RSS Sources
            rss_sources = [
                {
                    'name': 'TechCrunch',
                    'url': 'https://techcrunch.com/feed/',
                    'category': 'Technology'
                },
                {
                    'name': 'Ars Technica',
                    'url': 'https://feeds.arstechnica.com/arstechnica/index',
                    'category': 'Technology'
                },
                {
                    'name': 'Wired',
                    'url': 'https://www.wired.com/feed/rss',
                    'category': 'Technology'
                },
                {
                    'name': 'The Verge',
                    'url': 'https://www.theverge.com/rss/index.xml',
                    'category': 'Technology'
                }
            ]
            
            for source in rss_sources:
                try:
                    feed = feedparser.parse(source['url'])
                    
                    for entry in feed.entries[:5]:  # Top 5 from each source
                        article = {
                            'title': entry.get('title', ''),
                            'description': entry.get('summary', ''),
                            'url': entry.get('link', ''),
                            'published_at': entry.get('published', ''),
                            'source': {
                                'name': source['name'],
                                'category': source['category']
                            },
                            'tags': [tag.term for tag in entry.get('tags', [])],
                            'author': entry.get('author', 'Unknown')
                        }
                        
                        # Extract image if available
                        if hasattr(entry, 'media_content'):
                            for media in entry.media_content:
                                if media.get('type', '').startswith('image'):
                                    article['image_url'] = media.get('url')
                                    break
                                    
                        all_articles.append(article)
                        
                except Exception as e:
                    logger.warning(f"Failed to fetch from {source['name']}: {e}")
                    continue
                    
            # Sort by publication date (most recent first)
            all_articles.sort(key=lambda x: x.get('published_at', ''), reverse=True)
            
            news_data = {
                'articles': all_articles[:20],  # Top 20 articles
                'sources': [source['name'] for source in rss_sources],
                'categories': list(set([source['category'] for source in rss_sources])),
                'last_updated': datetime.now().isoformat()
            }
            
            self.save_json(news_data, 'tech-news.json')
            return True
            
        except Exception as e:
            logger.error(f"Failed to fetch news data: {e}")
            return False
            
    def fetch_weather_data(self):
        """Fetch weather data for Nairobi (user location)"""
        try:
            # Using Open-Meteo API (no key required)
            url = 'https://api.open-meteo.com/v1/forecast'
            params = {
                'latitude': -1.2921,   # Nairobi coordinates
                'longitude': 36.8219,
                'current_weather': 'true',
                'hourly': 'temperature_2m,relative_humidity_2m,weather_code',
                'daily': 'weather_code,temperature_2m_max,temperature_2m_min',
                'timezone': 'Africa/Nairobi',
                'forecast_days': 7
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            weather_raw = response.json()
            
            # Weather code descriptions
            weather_codes = {
                0: 'Clear sky',
                1: 'Mainly clear',
                2: 'Partly cloudy',
                3: 'Overcast',
                45: 'Fog',
                48: 'Depositing rime fog',
                51: 'Light drizzle',
                53: 'Moderate drizzle',
                55: 'Dense drizzle',
                61: 'Slight rain',
                63: 'Moderate rain',
                65: 'Heavy rain',
                80: 'Slight rain showers',
                81: 'Moderate rain showers',
                82: 'Violent rain showers',
                95: 'Thunderstorm',
                96: 'Thunderstorm with slight hail',
                99: 'Thunderstorm with heavy hail'
            }
            
            current = weather_raw.get('current_weather', {})
            
            weather_data = {
                'location': {
                    'city': 'Nairobi',
                    'country': 'Kenya',
                    'latitude': -1.2921,
                    'longitude': 36.8219,
                    'timezone': 'Africa/Nairobi'
                },
                'current': {
                    'temperature': current.get('temperature'),
                    'weather_code': current.get('weathercode'),
                    'weather_description': weather_codes.get(current.get('weathercode', 0), 'Unknown'),
                    'wind_speed': current.get('windspeed'),
                    'wind_direction': current.get('winddirection'),
                    'time': current.get('time')
                },
                'forecast': {
                    'daily': weather_raw.get('daily', {}),
                    'hourly': weather_raw.get('hourly', {})
                },
                'units': weather_raw.get('units', {})
            }
            
            self.save_json(weather_data, 'weather.json')
            return True
            
        except Exception as e:
            logger.error(f"Failed to fetch weather data: {e}")
            return False
            
    def fetch_crypto_data(self):
        """Fetch cryptocurrency data"""
        try:
            # Using CoinGecko API (no key required)
            url = 'https://api.coingecko.com/api/v3/simple/price'
            params = {
                'ids': 'bitcoin,ethereum,cardano,polkadot,chainlink,solana',
                'vs_currencies': 'usd,eur',
                'include_24hr_change': 'true',
                'include_market_cap': 'true',
                'include_24hr_vol': 'true'
            }
            
            response = self.session.get(url, params=params)
            response.raise_for_status()
            crypto_prices = response.json()
            
            # Get trending coins
            trending_url = 'https://api.coingecko.com/api/v3/search/trending'
            trending_response = self.session.get(trending_url)
            trending_response.raise_for_status()
            trending_data = trending_response.json()
            
            crypto_data = {
                'prices': crypto_prices,
                'trending': trending_data.get('coins', [])[:7],  # Top 7 trending
                'last_updated': datetime.now().isoformat(),
                'disclaimer': 'Data from CoinGecko API for educational purposes'
            }
            
            self.save_json(crypto_data, 'crypto.json')
            return True
            
        except Exception as e:
            logger.error(f"Failed to fetch crypto data: {e}")
            return False
            
    def fetch_quotes_data(self):
        """Fetch inspirational quotes"""
        try:
            quotes = []
            
            # Quotable API (no key required)
            for _ in range(10):  # Fetch 10 random quotes
                response = self.session.get('https://api.quotable.io/random')
                response.raise_for_status()
                quote_data = response.json()
                
                quotes.append({
                    'content': quote_data.get('content'),
                    'author': quote_data.get('author'),
                    'tags': quote_data.get('tags', []),
                    'length': quote_data.get('length')
                })
                
                time.sleep(0.1)  # Be nice to the API
                
            quotes_data = {
                'quotes': quotes,
                'categories': list(set([tag for quote in quotes for tag in quote.get('tags', [])])),
                'total_fetched': len(quotes)
            }
            
            self.save_json(quotes_data, 'quotes.json')
            return True
            
        except Exception as e:
            logger.error(f"Failed to fetch quotes data: {e}")
            return False
            
    def fetch_wikipedia_data(self):
        """Fetch relevant Wikipedia content for tech topics"""
        try:
            topics = [
                'Artificial intelligence',
                'Machine learning',
                'Web development',
                'Data science',
                'Blockchain',
                'Cloud computing'
            ]
            
            wikipedia_data = {'articles': []}
            
            for topic in topics:
                try:
                    # Search for the topic
                    search_url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + quote(topic)
                    response = self.session.get(search_url)
                    response.raise_for_status()
                    
                    article_data = response.json()
                    
                    wikipedia_data['articles'].append({
                        'title': article_data.get('title'),
                        'extract': article_data.get('extract'),
                        'description': article_data.get('description'),
                        'url': article_data.get('content_urls', {}).get('desktop', {}).get('page'),
                        'thumbnail': article_data.get('thumbnail', {}).get('source') if article_data.get('thumbnail') else None,
                        'lang': article_data.get('lang'),
                        'topic': topic
                    })
                    
                    time.sleep(0.2)  # Be respectful to Wikipedia API
                    
                except Exception as e:
                    logger.warning(f"Failed to fetch Wikipedia article for {topic}: {e}")
                    continue
                    
            self.save_json(wikipedia_data, 'wikipedia.json')
            return True
            
        except Exception as e:
            logger.error(f"Failed to fetch Wikipedia data: {e}")
            return False
            
    def fetch_time_data(self):
        """Fetch time zone data"""
        try:
            # WorldTimeAPI (no key required)
            timezones = [
                'Africa/Nairobi',    # User location
                'America/New_York',  # EST
                'Europe/London',     # GMT
                'Asia/Tokyo',        # JST
                'Australia/Sydney'   # AEST
            ]
            
            time_data = {'timezones': []}
            
            for tz in timezones:
                try:
                    response = self.session.get(f'https://worldtimeapi.org/api/timezone/{tz}')
                    response.raise_for_status()
                    tz_data = response.json()
                    
                    time_data['timezones'].append({
                        'timezone': tz,
                        'datetime': tz_data.get('datetime'),
                        'utc_offset': tz_data.get('utc_offset'),
                        'abbreviation': tz_data.get('abbreviation'),
                        'day_of_week': tz_data.get('day_of_week'),
                        'day_of_year': tz_data.get('day_of_year'),
                        'week_number': tz_data.get('week_number')
                    })
                    
                except Exception as e:
                    logger.warning(f"Failed to fetch time for {tz}: {e}")
                    continue
                    
            self.save_json(time_data, 'worldtime.json')
            return True
            
        except Exception as e:
            logger.error(f"Failed to fetch time data: {e}")
            return False
            
    def fetch_hackernews_data(self):
        """Fetch Hacker News top stories"""
        try:
            # Get top story IDs
            top_stories_response = self.session.get('https://hacker-news.firebaseio.com/v0/topstories.json')
            top_stories_response.raise_for_status()
            story_ids = top_stories_response.json()[:20]  # Top 20 stories
            
            stories = []
            for story_id in story_ids:
                try:
                    story_response = self.session.get(f'https://hacker-news.firebaseio.com/v0/item/{story_id}.json')
                    story_response.raise_for_status()
                    story_data = story_response.json()
                    
                    stories.append({
                        'id': story_data.get('id'),
                        'title': story_data.get('title'),
                        'url': story_data.get('url'),
                        'score': story_data.get('score'),
                        'by': story_data.get('by'),
                        'time': story_data.get('time'),
                        'descendants': story_data.get('descendants'),  # comment count
                        'type': story_data.get('type')
                    })
                    
                    time.sleep(0.1)  # Rate limiting
                    
                except Exception as e:
                    logger.warning(f"Failed to fetch story {story_id}: {e}")
                    continue
                    
            hn_data = {
                'stories': stories,
                'total_fetched': len(stories),
                'source': 'Hacker News API'
            }
            
            self.save_json(hn_data, 'hackernews.json')
            return True
            
        except Exception as e:
            logger.error(f"Failed to fetch Hacker News data: {e}")
            return False
            
    def run_all_fetchers(self, specific_apis=None):
        """Run all API fetchers"""
        if specific_apis:
            apis_to_run = {k: v for k, v in self.apis.items() if k in specific_apis}
        else:
            apis_to_run = {k: v for k, v in self.apis.items() if v['enabled']}
            
        results = {}
        
        for api_name, config in apis_to_run.items():
            logger.info(f"Fetching {api_name} data...")
            
            try:
                success = config['fetcher']()
                results[api_name] = 'success' if success else 'failed'
                
                if success:
                    logger.info(f"✓ {api_name} data fetched successfully")
                else:
                    logger.error(f"✗ {api_name} data fetch failed")
                    
            except Exception as e:
                logger.error(f"✗ {api_name} data fetch failed with exception: {e}")
                results[api_name] = 'error'
                
            # Rate limiting
            time.sleep(0.5)
            
        # Save fetch summary
        summary = {
            'fetch_time': datetime.now().isoformat(),
            'results': results,
            'success_count': len([r for r in results.values() if r == 'success']),
            'total_apis': len(results),
            'next_scheduled_fetch': (datetime.now() + timedelta(hours=4)).isoformat()
        }
        
        self.save_json(summary, 'fetch-summary.json')
        
        logger.info(f"API fetch completed: {summary['success_count']}/{summary['total_apis']} successful")
        return summary

# Main execution
if __name__ == "__main__":
    fetcher = APIDataFetcher()
    
    # Check for specific APIs argument
    specific_apis = None
    if len(sys.argv) > 1:
        apis_arg = sys.argv[1]
        if apis_arg != 'all':
            specific_apis = [api.strip() for api in apis_arg.split(',')]
            
    # Run the fetcher
    try:
        summary = fetcher.run_all_fetchers(specific_apis)
        
        # Exit with error code if any fetches failed
        if summary['success_count'] < summary['total_apis']:
            sys.exit(1)
        else:
            sys.exit(0)
            
    except Exception as e:
        logger.error(f"Fatal error in API fetcher: {e}")
        sys.exit(1)
